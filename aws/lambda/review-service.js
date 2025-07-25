// 📝 리뷰 서비스 Lambda 함수
// 사찰 법회 리뷰 관리 및 평점 시스템

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'BuddhistCommunity-Reviews';
const TEMPLES_TABLE = process.env.TEMPLES_TABLE || 'BuddhistCommunity-Temples';
const REGION = process.env.AWS_REGION || 'ap-northeast-2';

// CORS 헤더
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Content-Type': 'application/json'
};

// 응답 헬퍼 함수
const createResponse = (statusCode, body) => ({
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
});

// 에러 핸들링
const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    return createResponse(500, {
        error: '서버 오류가 발생했습니다',
        message: error.message,
        context
    });
};

// 입력 검증
const validateReviewData = (data) => {
    const required = ['title', 'content', 'rating', 'category'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
        throw new Error(`필수 필드가 누락되었습니다: ${missing.join(', ')}`);
    }
    
    if (data.rating < 1 || data.rating > 5) {
        throw new Error('평점은 1-5 사이여야 합니다');
    }
    
    const validCategories = ['명상', '법문', '체험', '행사', '템플스테이'];
    if (!validCategories.includes(data.category)) {
        throw new Error(`유효하지 않은 카테고리입니다. 사용 가능: ${validCategories.join(', ')}`);
    }
    
    if (data.title.length > 100) {
        throw new Error('제목은 100자 이하여야 합니다');
    }
    
    if (data.content.length > 2000) {
        throw new Error('내용은 2000자 이하여야 합니다');
    }
    
    return true;
};

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { httpMethod, pathParameters, queryStringParameters, body, requestContext } = event;
    const templeId = pathParameters?.templeId;
    const reviewId = pathParameters?.reviewId;
    const userId = requestContext?.authorizer?.claims?.sub;
    
    try {
        // OPTIONS 요청 (CORS preflight)
        if (httpMethod === 'OPTIONS') {
            return createResponse(200, { message: 'CORS preflight' });
        }

        // 라우팅
        switch (httpMethod) {
            case 'GET':
                if (reviewId) {
                    return await getReview(templeId, reviewId);
                } else if (templeId) {
                    return await getTempleReviews(templeId, queryStringParameters);
                } else if (queryStringParameters?.user) {
                    return await getUserReviews(queryStringParameters.user, queryStringParameters);
                } else {
                    return await listReviews(queryStringParameters);
                }
                
            case 'POST':
                if (!templeId) {
                    return createResponse(400, { error: '사찰 ID가 필요합니다' });
                }
                if (!userId) {
                    return createResponse(401, { error: '로그인이 필요합니다' });
                }
                return await createReview(templeId, JSON.parse(body || '{}'), userId);
                
            case 'PUT':
                if (!reviewId || !templeId) {
                    return createResponse(400, { error: '사찰 ID와 리뷰 ID가 필요합니다' });
                }
                if (!userId) {
                    return createResponse(401, { error: '로그인이 필요합니다' });
                }
                return await updateReview(templeId, reviewId, JSON.parse(body || '{}'), userId);
                
            case 'DELETE':
                if (!reviewId || !templeId) {
                    return createResponse(400, { error: '사찰 ID와 리뷰 ID가 필요합니다' });
                }
                if (!userId) {
                    return createResponse(401, { error: '로그인이 필요합니다' });
                }
                return await deleteReview(templeId, reviewId, userId);
                
            default:
                return createResponse(405, { error: '지원하지 않는 HTTP 메서드입니다' });
        }
        
    } catch (error) {
        return handleError(error, 'Main handler');
    }
};

// 📝 사찰별 리뷰 목록 조회
async function getTempleReviews(templeId, queryParams = {}) {
    try {
        const { limit = 20, lastKey, category, sortBy = 'recent' } = queryParams;
        
        let params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: 'PK = :templeKey',
            ExpressionAttributeValues: {
                ':templeKey': `TEMPLE#${templeId}`
            },
            Limit: parseInt(limit),
            ScanIndexForward: sortBy === 'oldest' // false = 최신순, true = 오래된순
        };
        
        // 카테고리별 필터링
        if (category) {
            params.IndexName = 'GSI2-Category-Rating';
            params.KeyConditionExpression = 'GSI2PK = :category';
            params.ExpressionAttributeValues = {
                ':category': `CATEGORY#${category}`
            };
            params.ScanIndexForward = false; // 높은 평점 순
        }
        
        // 평점순 정렬
        if (sortBy === 'rating') {
            params.ScanIndexForward = false;
            // 추가적으로 평점 기준 정렬을 위해 GSI 사용 가능
        }
        
        // 페이지네이션
        if (lastKey) {
            params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
        }
        
        const result = await dynamodb.query(params).promise();
        
        // 응답 데이터 정리
        const reviews = result.Items.map(formatReviewResponse);
        
        // 통계 정보 계산
        const stats = calculateReviewStats(reviews);
        
        const response = {
            reviews,
            stats,
            totalCount: reviews.length,
            lastKey: result.LastEvaluatedKey ? 
                encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
        };
        
        return createResponse(200, response);
        
    } catch (error) {
        return handleError(error, 'getTempleReviews');
    }
}

// 👤 사용자별 리뷰 목록 조회
async function getUserReviews(userId, queryParams = {}) {
    try {
        const { limit = 10, lastKey } = queryParams;
        
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'GSI1-User-Created',
            KeyConditionExpression: 'GSI1PK = :userKey',
            ExpressionAttributeValues: {
                ':userKey': `USER#${userId}`
            },
            Limit: parseInt(limit),
            ScanIndexForward: false // 최신순
        };
        
        // 페이지네이션
        if (lastKey) {
            params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
        }
        
        const result = await dynamodb.query(params).promise();
        const reviews = result.Items.map(formatReviewResponse);
        
        const response = {
            reviews,
            totalCount: reviews.length,
            lastKey: result.LastEvaluatedKey ? 
                encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
        };
        
        return createResponse(200, response);
        
    } catch (error) {
        return handleError(error, 'getUserReviews');
    }
}

// 📋 전체 리뷰 목록 조회 (관리용)
async function listReviews(queryParams = {}) {
    try {
        const { limit = 20, lastKey, category, minRating } = queryParams;
        
        let params = {
            TableName: TABLE_NAME,
            Limit: parseInt(limit)
        };
        
        // 필터 조건 추가
        const filterExpressions = [];
        const expressionAttributeValues = {};
        
        if (category) {
            filterExpressions.push('category = :category');
            expressionAttributeValues[':category'] = category;
        }
        
        if (minRating) {
            filterExpressions.push('rating >= :minRating');
            expressionAttributeValues[':minRating'] = parseInt(minRating);
        }
        
        if (filterExpressions.length > 0) {
            params.FilterExpression = filterExpressions.join(' AND ');
            params.ExpressionAttributeValues = expressionAttributeValues;
        }
        
        // 페이지네이션
        if (lastKey) {
            params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
        }
        
        const result = await dynamodb.scan(params).promise();
        const reviews = result.Items.map(formatReviewResponse);
        
        return createResponse(200, {
            reviews,
            totalCount: reviews.length,
            lastKey: result.LastEvaluatedKey ? 
                encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
        });
        
    } catch (error) {
        return handleError(error, 'listReviews');
    }
}

// 📝 단일 리뷰 조회
async function getReview(templeId, reviewId) {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `TEMPLE#${templeId}`,
                SK: `REVIEW#${reviewId}`
            }
        };
        
        const result = await dynamodb.get(params).promise();
        
        if (!result.Item) {
            return createResponse(404, { 
                error: '리뷰를 찾을 수 없습니다',
                templeId,
                reviewId 
            });
        }
        
        return createResponse(200, {
            review: formatReviewResponse(result.Item)
        });
        
    } catch (error) {
        return handleError(error, 'getReview');
    }
}

// ➕ 새 리뷰 생성
async function createReview(templeId, reviewData, userId) {
    try {
        validateReviewData(reviewData);
        
        const reviewId = generateReviewId();
        const timestamp = new Date().toISOString();
        
        const review = {
            PK: `TEMPLE#${templeId}`,
            SK: `REVIEW#${reviewId}`,
            reviewId,
            templeId,
            userId,
            title: reviewData.title,
            content: reviewData.content,
            rating: parseInt(reviewData.rating),
            category: reviewData.category,
            visitDate: reviewData.visitDate || timestamp.split('T')[0],
            isRecommended: reviewData.isRecommended || false,
            tags: reviewData.tags || [],
            helpfulCount: 0,
            createdAt: timestamp,
            updatedAt: timestamp,
            
            // GSI 키들
            GSI1PK: `USER#${userId}`,
            GSI1SK: `CREATED#${timestamp}`,
            GSI2PK: `CATEGORY#${reviewData.category}`,
            GSI2SK: `RATING#${String(reviewData.rating).padStart(1, '0')}`
        };
        
        // 트랜잭션으로 리뷰 생성 + 사찰 평점 업데이트
        const transactParams = {
            TransactItems: [
                // 리뷰 생성
                {
                    Put: {
                        TableName: TABLE_NAME,
                        Item: review,
                        ConditionExpression: 'attribute_not_exists(PK)'
                    }
                },
                // 사찰 평점 업데이트
                {
                    Update: {
                        TableName: TEMPLES_TABLE,
                        Key: {
                            PK: `TEMPLE#${templeId}`,
                            SK: 'INFO'
                        },
                        UpdateExpression: 'ADD reviewCount :one, totalRating :rating SET updatedAt = :timestamp',
                        ExpressionAttributeValues: {
                            ':one': 1,
                            ':rating': parseInt(reviewData.rating),
                            ':timestamp': timestamp
                        }
                    }
                }
            ]
        };
        
        await dynamodb.transactWrite(transactParams).promise();
        
        // 사찰 평균 평점 재계산
        await updateTempleAverageRating(templeId);
        
        return createResponse(201, {
            message: '리뷰가 성공적으로 등록되었습니다',
            review: formatReviewResponse(review)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(409, { 
                error: '이미 존재하는 리뷰입니다' 
            });
        }
        return handleError(error, 'createReview');
    }
}

// ✏️ 리뷰 업데이트
async function updateReview(templeId, reviewId, updateData, userId) {
    try {
        // 권한 확인을 위해 기존 리뷰 조회
        const existingReview = await dynamodb.get({
            TableName: TABLE_NAME,
            Key: {
                PK: `TEMPLE#${templeId}`,
                SK: `REVIEW#${reviewId}`
            }
        }).promise();
        
        if (!existingReview.Item) {
            return createResponse(404, { error: '리뷰를 찾을 수 없습니다' });
        }
        
        if (existingReview.Item.userId !== userId) {
            return createResponse(403, { error: '본인의 리뷰만 수정할 수 있습니다' });
        }
        
        const timestamp = new Date().toISOString();
        
        // 업데이트 가능한 필드만 필터링
        const allowedFields = ['title', 'content', 'rating', 'category', 'visitDate', 'isRecommended', 'tags'];
        const updates = Object.keys(updateData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});
        
        if (Object.keys(updates).length === 0) {
            return createResponse(400, { 
                error: '업데이트할 유효한 필드가 없습니다' 
            });
        }
        
        // 평점이 변경된 경우 검증
        if (updates.rating) {
            if (updates.rating < 1 || updates.rating > 5) {
                return createResponse(400, { error: '평점은 1-5 사이여야 합니다' });
            }
            updates.rating = parseInt(updates.rating);
        }
        
        // 업데이트 표현식 생성
        const updateExpression = 'SET ' + Object.keys(updates)
            .map(key => `#${key} = :${key}`)
            .join(', ') + ', updatedAt = :timestamp';
        
        const expressionAttributeNames = Object.keys(updates)
            .reduce((obj, key) => {
                obj[`#${key}`] = key;
                return obj;
            }, {});
        
        const expressionAttributeValues = Object.keys(updates)
            .reduce((obj, key) => {
                obj[`:${key}`] = updates[key];
                return obj;
            }, { ':timestamp': timestamp });
        
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `TEMPLE#${templeId}`,
                SK: `REVIEW#${reviewId}`
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };
        
        const result = await dynamodb.update(params).promise();
        
        // 평점이 변경된 경우 사찰 평균 평점 재계산
        if (updates.rating && updates.rating !== existingReview.Item.rating) {
            await updateTempleAverageRating(templeId);
        }
        
        return createResponse(200, {
            message: '리뷰가 업데이트되었습니다',
            review: formatReviewResponse(result.Attributes)
        });
        
    } catch (error) {
        return handleError(error, 'updateReview');
    }
}

// 🗑️ 리뷰 삭제
async function deleteReview(templeId, reviewId, userId) {
    try {
        // 권한 확인을 위해 기존 리뷰 조회
        const existingReview = await dynamodb.get({
            TableName: TABLE_NAME,
            Key: {
                PK: `TEMPLE#${templeId}`,
                SK: `REVIEW#${reviewId}`
            }
        }).promise();
        
        if (!existingReview.Item) {
            return createResponse(404, { error: '리뷰를 찾을 수 없습니다' });
        }
        
        if (existingReview.Item.userId !== userId) {
            return createResponse(403, { error: '본인의 리뷰만 삭제할 수 있습니다' });
        }
        
        const timestamp = new Date().toISOString();
        const rating = existingReview.Item.rating;
        
        // 트랜잭션으로 리뷰 삭제 + 사찰 통계 업데이트
        const transactParams = {
            TransactItems: [
                // 리뷰 삭제
                {
                    Delete: {
                        TableName: TABLE_NAME,
                        Key: {
                            PK: `TEMPLE#${templeId}`,
                            SK: `REVIEW#${reviewId}`
                        }
                    }
                },
                // 사찰 통계 업데이트
                {
                    Update: {
                        TableName: TEMPLES_TABLE,
                        Key: {
                            PK: `TEMPLE#${templeId}`,
                            SK: 'INFO'
                        },
                        UpdateExpression: 'ADD reviewCount :minusOne, totalRating :minusRating SET updatedAt = :timestamp',
                        ExpressionAttributeValues: {
                            ':minusOne': -1,
                            ':minusRating': -rating,
                            ':timestamp': timestamp
                        },
                        ConditionExpression: 'reviewCount > :zero',
                        ExpressionAttributeValues: {
                            ...{
                                ':minusOne': -1,
                                ':minusRating': -rating,
                                ':timestamp': timestamp
                            },
                            ':zero': 0
                        }
                    }
                }
            ]
        };
        
        await dynamodb.transactWrite(transactParams).promise();
        
        // 사찰 평균 평점 재계산
        await updateTempleAverageRating(templeId);
        
        return createResponse(200, {
            message: '리뷰가 삭제되었습니다',
            deletedReview: formatReviewResponse(existingReview.Item)
        });
        
    } catch (error) {
        return handleError(error, 'deleteReview');
    }
}

// 🔧 헬퍼 함수들

// 리뷰 ID 생성
function generateReviewId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// 응답 데이터 포맷팅
function formatReviewResponse(item) {
    if (!item) return null;
    
    // DynamoDB 내부 필드 제거
    const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...review } = item;
    
    return {
        ...review,
        rating: Number(review.rating || 0),
        helpfulCount: Number(review.helpfulCount || 0),
        tags: review.tags || [],
        isRecommended: Boolean(review.isRecommended)
    };
}

// 리뷰 통계 계산
function calculateReviewStats(reviews) {
    if (reviews.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            categoryDistribution: {},
            recommendationRate: 0
        };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
    
    const ratingDistribution = reviews.reduce((dist, review) => {
        dist[review.rating] = (dist[review.rating] || 0) + 1;
        return dist;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    
    const categoryDistribution = reviews.reduce((dist, review) => {
        dist[review.category] = (dist[review.category] || 0) + 1;
        return dist;
    }, {});
    
    const recommendedCount = reviews.filter(review => review.isRecommended).length;
    const recommendationRate = Math.round((recommendedCount / reviews.length) * 100);
    
    return {
        averageRating,
        totalReviews: reviews.length,
        ratingDistribution,
        categoryDistribution,
        recommendationRate
    };
}

// 사찰 평균 평점 업데이트
async function updateTempleAverageRating(templeId) {
    try {
        // 해당 사찰의 모든 리뷰 조회
        const reviewsResult = await dynamodb.query({
            TableName: TABLE_NAME,
            KeyConditionExpression: 'PK = :templeKey',
            ExpressionAttributeValues: {
                ':templeKey': `TEMPLE#${templeId}`
            }
        }).promise();
        
        const reviews = reviewsResult.Items;
        const stats = calculateReviewStats(reviews.map(formatReviewResponse));
        
        // 사찰 테이블 업데이트
        await dynamodb.update({
            TableName: TEMPLES_TABLE,
            Key: {
                PK: `TEMPLE#${templeId}`,
                SK: 'INFO'
            },
            UpdateExpression: 'SET rating = :avgRating, reviewCount = :count, updatedAt = :timestamp',
            ExpressionAttributeValues: {
                ':avgRating': stats.averageRating,
                ':count': stats.totalReviews,
                ':timestamp': new Date().toISOString()
            }
        }).promise();
        
    } catch (error) {
        console.error('Error updating temple average rating:', error);
        // 평점 업데이트 실패는 전체 요청을 실패시키지 않음
    }
}