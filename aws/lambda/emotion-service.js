// 🧘‍♀️ 감정 체크인 서비스 Lambda 함수
// 일일 감정 상태 기록 및 마음챙김 통계

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'BuddhistCommunity-EmotionalCheckins';
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

// 감정 상태 검증
const validateEmotionData = (data) => {
    const required = ['emotion', 'intensity'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
        throw new Error(`필수 필드가 누락되었습니다: ${missing.join(', ')}`);
    }
    
    const validEmotions = [
        '평화로운', '감사한', '기쁜', '차분한', '희망찬',
        '불안한', '슬픈', '화난', '혼란스러운', '두려운',
        '고요한', '성찰적인', '겸손한', '자비로운', '집중된'
    ];
    
    if (!validEmotions.includes(data.emotion)) {
        throw new Error(`유효하지 않은 감정 상태입니다. 사용 가능: ${validEmotions.join(', ')}`);
    }
    
    if (data.intensity < 1 || data.intensity > 10) {
        throw new Error('감정 강도는 1-10 사이여야 합니다');
    }
    
    if (data.description && data.description.length > 500) {
        throw new Error('상세 설명은 500자 이하여야 합니다');
    }
    
    if (data.note && data.note.length > 1000) {
        throw new Error('개인 메모는 1000자 이하여야 합니다');
    }
    
    return true;
};

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { httpMethod, pathParameters, queryStringParameters, body, requestContext } = event;
    const userId = pathParameters?.userId;
    const date = pathParameters?.date;
    const cognitoUserId = requestContext?.authorizer?.claims?.sub;
    
    try {
        // OPTIONS 요청 (CORS preflight)
        if (httpMethod === 'OPTIONS') {
            return createResponse(200, { message: 'CORS preflight' });
        }

        // 인증 확인
        if (!cognitoUserId) {
            return createResponse(401, { error: '로그인이 필요합니다' });
        }

        // 권한 확인 (본인 데이터만 접근 가능)
        if (userId && userId !== cognitoUserId) {
            return createResponse(403, { error: '본인의 감정 기록만 접근할 수 있습니다' });
        }

        const actualUserId = userId || cognitoUserId;

        // 라우팅
        switch (httpMethod) {
            case 'GET':
                if (date) {
                    return await getEmotionCheckin(actualUserId, date);
                } else if (queryStringParameters?.stats) {
                    return await getEmotionStats(actualUserId, queryStringParameters);
                } else {
                    return await getEmotionHistory(actualUserId, queryStringParameters);
                }
                
            case 'POST':
                const checkinData = JSON.parse(body || '{}');
                return await createEmotionCheckin(actualUserId, checkinData);
                
            case 'PUT':
                if (!date) {
                    return createResponse(400, { error: '날짜가 필요합니다' });
                }
                const updateData = JSON.parse(body || '{}');
                return await updateEmotionCheckin(actualUserId, date, updateData);
                
            case 'DELETE':
                if (!date) {
                    return createResponse(400, { error: '날짜가 필요합니다' });
                }
                return await deleteEmotionCheckin(actualUserId, date);
                
            default:
                return createResponse(405, { error: '지원하지 않는 HTTP 메서드입니다' });
        }
        
    } catch (error) {
        return handleError(error, 'Main handler');
    }
};

// 📊 감정 기록 목록 조회
async function getEmotionHistory(userId, queryParams = {}) {
    try {
        const { 
            limit = 30, 
            lastKey, 
            startDate, 
            endDate,
            emotion 
        } = queryParams;
        
        let params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: 'PK = :userKey',
            ExpressionAttributeValues: {
                ':userKey': `USER#${userId}`
            },
            Limit: parseInt(limit),
            ScanIndexForward: false // 최신순
        };
        
        // 날짜 범위 필터링
        if (startDate || endDate) {
            const dateConditions = [];
            
            if (startDate) {
                dateConditions.push('SK >= :startDate');
                params.ExpressionAttributeValues[':startDate'] = `CHECKIN#${startDate}`;
            }
            
            if (endDate) {
                dateConditions.push('SK <= :endDate');
                params.ExpressionAttributeValues[':endDate'] = `CHECKIN#${endDate}`;
            }
            
            if (dateConditions.length > 0) {
                params.KeyConditionExpression += ' AND ' + dateConditions.join(' AND ');
            }
        }
        
        // 감정 상태 필터링
        if (emotion) {
            params.FilterExpression = 'emotion = :emotion';
            params.ExpressionAttributeValues[':emotion'] = emotion;
        }
        
        // 페이지네이션
        if (lastKey) {
            params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
        }
        
        const result = await dynamodb.query(params).promise();
        
        // 응답 데이터 정리
        const checkins = result.Items.map(formatEmotionResponse);
        
        const response = {
            checkins,
            totalCount: checkins.length,
            lastKey: result.LastEvaluatedKey ? 
                encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
        };
        
        return createResponse(200, response);
        
    } catch (error) {
        return handleError(error, 'getEmotionHistory');
    }
}

// 📈 감정 통계 조회
async function getEmotionStats(userId, queryParams = {}) {
    try {
        const { 
            period = '30d', // 7d, 30d, 90d, 1y
            startDate,
            endDate 
        } = queryParams;
        
        // 기간 계산
        const now = new Date();
        let start, end;
        
        if (startDate && endDate) {
            start = startDate;
            end = endDate;
        } else {
            end = now.toISOString().split('T')[0];
            const daysBack = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
            start = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
                .toISOString().split('T')[0];
        }
        
        // 기간 내 모든 감정 기록 조회
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: 'PK = :userKey AND SK BETWEEN :startDate AND :endDate',
            ExpressionAttributeValues: {
                ':userKey': `USER#${userId}`,
                ':startDate': `CHECKIN#${start}`,
                ':endDate': `CHECKIN#${end}`
            }
        };
        
        const result = await dynamodb.query(params).promise();
        const checkins = result.Items.map(formatEmotionResponse);
        
        // 통계 계산
        const stats = calculateEmotionStats(checkins, period);
        
        return createResponse(200, {
            stats,
            period: { start, end, type: period },
            totalCheckins: checkins.length
        });
        
    } catch (error) {
        return handleError(error, 'getEmotionStats');
    }
}

// 📝 특정 날짜 감정 체크인 조회
async function getEmotionCheckin(userId, date) {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `USER#${userId}`,
                SK: `CHECKIN#${date}`
            }
        };
        
        const result = await dynamodb.get(params).promise();
        
        if (!result.Item) {
            return createResponse(404, { 
                error: '해당 날짜의 감정 기록을 찾을 수 없습니다',
                date 
            });
        }
        
        return createResponse(200, {
            checkin: formatEmotionResponse(result.Item)
        });
        
    } catch (error) {
        return handleError(error, 'getEmotionCheckin');
    }
}

// ➕ 새 감정 체크인 생성
async function createEmotionCheckin(userId, emotionData) {
    try {
        validateEmotionData(emotionData);
        
        const date = emotionData.date || new Date().toISOString().split('T')[0];
        const timestamp = new Date().toISOString();
        
        const checkin = {
            PK: `USER#${userId}`,
            SK: `CHECKIN#${date}`,
            userId,
            date,
            emotion: emotionData.emotion,
            intensity: parseInt(emotionData.intensity),
            description: emotionData.description || '',
            note: emotionData.note || '',
            createdAt: timestamp,
            
            // GSI 키들 (전체 사용자 감정 분석용)
            GSI1PK: `DATE#${date}`,
            GSI1SK: `EMOTION#${emotionData.emotion}`
        };
        
        const params = {
            TableName: TABLE_NAME,
            Item: checkin,
            ConditionExpression: 'attribute_not_exists(PK)'
        };
        
        await dynamodb.put(params).promise();
        
        return createResponse(201, {
            message: '감정 체크인이 성공적으로 기록되었습니다',
            checkin: formatEmotionResponse(checkin)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(409, { 
                error: '해당 날짜에 이미 감정 체크인이 존재합니다. 수정을 원하시면 PUT 요청을 사용하세요.' 
            });
        }
        return handleError(error, 'createEmotionCheckin');
    }
}

// ✏️ 감정 체크인 업데이트
async function updateEmotionCheckin(userId, date, updateData) {
    try {
        // 부분 검증 (필수 필드 제외)
        if (updateData.emotion) {
            const validEmotions = [
                '평화로운', '감사한', '기쁜', '차분한', '희망찬',
                '불안한', '슬픈', '화난', '혼란스러운', '두려운',
                '고요한', '성찰적인', '겸손한', '자비로운', '집중된'
            ];
            
            if (!validEmotions.includes(updateData.emotion)) {
                return createResponse(400, { 
                    error: `유효하지 않은 감정 상태입니다. 사용 가능: ${validEmotions.join(', ')}` 
                });
            }
        }
        
        if (updateData.intensity && (updateData.intensity < 1 || updateData.intensity > 10)) {
            return createResponse(400, { error: '감정 강도는 1-10 사이여야 합니다' });
        }
        
        const timestamp = new Date().toISOString();
        
        // 업데이트 가능한 필드만 필터링
        const allowedFields = ['emotion', 'intensity', 'description', 'note'];
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
        
        // 강도는 숫자로 변환
        if (updates.intensity) {
            updates.intensity = parseInt(updates.intensity);
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
                PK: `USER#${userId}`,
                SK: `CHECKIN#${date}`
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
            ConditionExpression: 'attribute_exists(PK)'
        };
        
        const result = await dynamodb.update(params).promise();
        
        return createResponse(200, {
            message: '감정 체크인이 업데이트되었습니다',
            checkin: formatEmotionResponse(result.Attributes)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(404, { 
                error: '해당 날짜의 감정 기록을 찾을 수 없습니다' 
            });
        }
        return handleError(error, 'updateEmotionCheckin');
    }
}

// 🗑️ 감정 체크인 삭제
async function deleteEmotionCheckin(userId, date) {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `USER#${userId}`,
                SK: `CHECKIN#${date}`
            },
            ConditionExpression: 'attribute_exists(PK)',
            ReturnValues: 'ALL_OLD'
        };
        
        const result = await dynamodb.delete(params).promise();
        
        return createResponse(200, {
            message: '감정 체크인이 삭제되었습니다',
            deletedCheckin: formatEmotionResponse(result.Attributes)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(404, { 
                error: '해당 날짜의 감정 기록을 찾을 수 없습니다' 
            });
        }
        return handleError(error, 'deleteEmotionCheckin');
    }
}

// 🔧 헬퍼 함수들

// 응답 데이터 포맷팅
function formatEmotionResponse(item) {
    if (!item) return null;
    
    // DynamoDB 내부 필드 제거
    const { PK, SK, GSI1PK, GSI1SK, ...checkin } = item;
    
    return {
        ...checkin,
        intensity: Number(checkin.intensity || 0)
    };
}

// 감정 통계 계산
function calculateEmotionStats(checkins, period) {
    if (checkins.length === 0) {
        return {
            averageIntensity: 0,
            emotionDistribution: {},
            intensityTrend: [],
            moodPattern: {},
            insights: []
        };
    }
    
    // 평균 감정 강도
    const totalIntensity = checkins.reduce((sum, checkin) => sum + checkin.intensity, 0);
    const averageIntensity = Math.round((totalIntensity / checkins.length) * 10) / 10;
    
    // 감정 분포
    const emotionDistribution = checkins.reduce((dist, checkin) => {
        dist[checkin.emotion] = (dist[checkin.emotion] || 0) + 1;
        return dist;
    }, {});
    
    // 강도 트렌드 (최근 7일)
    const last7Days = checkins.slice(0, 7).reverse();
    const intensityTrend = last7Days.map(checkin => ({
        date: checkin.date,
        intensity: checkin.intensity,
        emotion: checkin.emotion
    }));
    
    // 요일별 기분 패턴
    const moodPattern = checkins.reduce((pattern, checkin) => {
        const dayOfWeek = new Date(checkin.date).getDay();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[dayOfWeek];
        
        if (!pattern[dayName]) {
            pattern[dayName] = { total: 0, count: 0, emotions: {} };
        }
        
        pattern[dayName].total += checkin.intensity;
        pattern[dayName].count += 1;
        pattern[dayName].emotions[checkin.emotion] = 
            (pattern[dayName].emotions[checkin.emotion] || 0) + 1;
        
        return pattern;
    }, {});
    
    // 평균 계산
    Object.keys(moodPattern).forEach(day => {
        moodPattern[day].average = Math.round(
            (moodPattern[day].total / moodPattern[day].count) * 10
        ) / 10;
    });
    
    // 인사이트 생성
    const insights = generateEmotionInsights(checkins, averageIntensity, emotionDistribution);
    
    return {
        averageIntensity,
        emotionDistribution,
        intensityTrend,
        moodPattern,
        insights,
        checkinStreak: calculateCheckinStreak(checkins),
        positiveEmotionRate: calculatePositiveEmotionRate(checkins)
    };
}

// 긍정 감정 비율 계산
function calculatePositiveEmotionRate(checkins) {
    const positiveEmotions = ['평화로운', '감사한', '기쁜', '차분한', '희망찬', '고요한', '자비로운', '집중된'];
    const positiveCount = checkins.filter(checkin => 
        positiveEmotions.includes(checkin.emotion)
    ).length;
    
    return checkins.length > 0 ? Math.round((positiveCount / checkins.length) * 100) : 0;
}

// 연속 체크인 일수 계산
function calculateCheckinStreak(checkins) {
    if (checkins.length === 0) return 0;
    
    const sortedDates = checkins
        .map(c => c.date)
        .sort()
        .reverse(); // 최신 날짜부터
    
    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    
    // 오늘부터 연속으로 체크인한 일수 계산
    for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        const previousDate = new Date(sortedDates[i-1]);
        const dayDiff = (previousDate - currentDate) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// 감정 인사이트 생성
function generateEmotionInsights(checkins, avgIntensity, emotionDist) {
    const insights = [];
    
    // 가장 빈번한 감정
    const mostFrequentEmotion = Object.keys(emotionDist)
        .reduce((a, b) => emotionDist[a] > emotionDist[b] ? a : b);
    
    insights.push({
        type: 'frequent_emotion',
        message: `가장 자주 느끼는 감정은 '${mostFrequentEmotion}'입니다.`,
        emotion: mostFrequentEmotion,
        count: emotionDist[mostFrequentEmotion]
    });
    
    // 감정 강도 분석
    if (avgIntensity >= 7) {
        insights.push({
            type: 'intensity_high',
            message: '감정을 깊이 있게 경험하고 계시네요. 마음챙김 명상을 통해 균형을 찾아보세요.',
            intensity: avgIntensity
        });
    } else if (avgIntensity <= 4) {
        insights.push({
            type: 'intensity_low',
            message: '차분한 마음 상태를 유지하고 계시네요. 이런 평온함을 소중히 여기세요.',
            intensity: avgIntensity
        });
    }
    
    // 긍정 감정 비율
    const positiveRate = calculatePositiveEmotionRate(checkins);
    if (positiveRate >= 70) {
        insights.push({
            type: 'positive_mindset',
            message: '긍정적인 마음 상태를 잘 유지하고 계시네요!',
            rate: positiveRate
        });
    }
    
    return insights;
}