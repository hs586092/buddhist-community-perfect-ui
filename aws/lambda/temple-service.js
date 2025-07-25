// 🏛️ 사찰 서비스 Lambda 함수
// DynamoDB와 연동하여 사찰 정보를 관리

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'BuddhistCommunity-Temples';
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
const validateTempleData = (data) => {
    const required = ['name', 'address', 'city', 'province'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
        throw new Error(`필수 필드가 누락되었습니다: ${missing.join(', ')}`);
    }
    
    if (data.rating && (data.rating < 0 || data.rating > 5)) {
        throw new Error('평점은 0-5 사이여야 합니다');
    }
    
    return true;
};

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { httpMethod, pathParameters, queryStringParameters, body } = event;
    const path = event.resource || event.requestContext?.routeKey;
    
    try {
        // OPTIONS 요청 (CORS preflight)
        if (httpMethod === 'OPTIONS') {
            return createResponse(200, { message: 'CORS preflight' });
        }

        // 라우팅
        switch (httpMethod) {
            case 'GET':
                if (pathParameters?.templeId) {
                    return await getTemple(pathParameters.templeId);
                } else if (queryStringParameters?.search) {
                    return await searchTemples(queryStringParameters);
                } else if (queryStringParameters?.nearby) {
                    return await getNearbyTemples(queryStringParameters);
                } else {
                    return await listTemples(queryStringParameters);
                }
                
            case 'POST':
                return await createTemple(JSON.parse(body || '{}'));
                
            case 'PUT':
                if (!pathParameters?.templeId) {
                    return createResponse(400, { error: '사찰 ID가 필요합니다' });
                }
                return await updateTemple(pathParameters.templeId, JSON.parse(body || '{}'));
                
            case 'DELETE':
                if (!pathParameters?.templeId) {
                    return createResponse(400, { error: '사찰 ID가 필요합니다' });
                }
                return await deleteTemple(pathParameters.templeId);
                
            default:
                return createResponse(405, { error: '지원하지 않는 HTTP 메서드입니다' });
        }
        
    } catch (error) {
        return handleError(error, 'Main handler');
    }
};

// 🏛️ 사찰 목록 조회
async function listTemples(queryParams = {}) {
    try {
        const { limit = 20, lastKey, city, province, sortBy = 'rating' } = queryParams;
        
        let params = {
            TableName: TABLE_NAME,
            Limit: parseInt(limit)
        };
        
        // 지역별 필터링
        if (city) {
            params.IndexName = 'GSI1-City-Rating';
            params.KeyConditionExpression = 'GSI1PK = :city';
            params.ExpressionAttributeValues = {
                ':city': `CITY#${city}`
            };
            params.ScanIndexForward = false; // 높은 평점 순
        } else if (province) {
            params.IndexName = 'GSI2-Province-Name';
            params.KeyConditionExpression = 'GSI2PK = :province';
            params.ExpressionAttributeValues = {
                ':province': `PROVINCE#${province}`
            };
        } else {
            // 전체 스캔 (비추천, 페이지네이션 필요)
            params = {
                ...params,
                FilterExpression: 'attribute_exists(#name)',
                ExpressionAttributeNames: {
                    '#name': 'name'
                }
            };
        }
        
        // 페이지네이션
        if (lastKey) {
            params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
        }
        
        const result = await dynamodb.query(params).promise();
        
        // 응답 데이터 정리
        const temples = result.Items.map(formatTempleResponse);
        
        const response = {
            temples,
            totalCount: temples.length,
            lastKey: result.LastEvaluatedKey ? 
                encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
        };
        
        return createResponse(200, response);
        
    } catch (error) {
        return handleError(error, 'listTemples');
    }
}

// 🔍 사찰 검색
async function searchTemples(queryParams) {
    try {
        const { search, limit = 10 } = queryParams;
        
        if (!search || search.length < 2) {
            return createResponse(400, { 
                error: '검색어는 2글자 이상이어야 합니다' 
            });
        }
        
        // DynamoDB는 전문 검색이 제한적이므로 OpenSearch 사용 권장
        // 여기서는 간단한 필터 검색 구현
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'contains(#name, :search) OR contains(address, :search)',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':search': search
            },
            Limit: parseInt(limit)
        };
        
        const result = await dynamodb.scan(params).promise();
        const temples = result.Items.map(formatTempleResponse);
        
        return createResponse(200, {
            temples,
            searchTerm: search,
            totalCount: temples.length
        });
        
    } catch (error) {
        return handleError(error, 'searchTemples');
    }
}

// 📍 근처 사찰 검색 (위도/경도 기반)
async function getNearbyTemples(queryParams) {
    try {
        const { lat, lng, radius = 10, limit = 10 } = queryParams;
        
        if (!lat || !lng) {
            return createResponse(400, { 
                error: '위도(lat)와 경도(lng)가 필요합니다' 
            });
        }
        
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const radiusKm = parseFloat(radius);
        
        // 모든 사찰을 가져와서 거리 계산 (실제로는 지리공간 인덱스 사용 권장)
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'attribute_exists(#location)',
            ExpressionAttributeNames: {
                '#location': 'location'
            },
            Limit: parseInt(limit) * 3 // 필터링을 고려해 더 많이 가져옴
        };
        
        const result = await dynamodb.scan(params).promise();
        
        // 거리 계산 및 필터링
        const nearbyTemples = result.Items
            .map(temple => {
                if (!temple.location || !temple.location.lat || !temple.location.lng) {
                    return null;
                }
                
                const distance = calculateDistance(
                    userLat, userLng,
                    temple.location.lat, temple.location.lng
                );
                
                return {
                    ...formatTempleResponse(temple),
                    distance: Math.round(distance * 10) / 10 // 소수점 첫째자리
                };
            })
            .filter(temple => temple && temple.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, parseInt(limit));
        
        return createResponse(200, {
            temples: nearbyTemples,
            searchCenter: { lat: userLat, lng: userLng },
            radius: radiusKm,
            totalCount: nearbyTemples.length
        });
        
    } catch (error) {
        return handleError(error, 'getNearbyTemples');
    }
}

// 🏛️ 단일 사찰 조회
async function getTemple(templeId) {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `TEMPLE#${templeId}`,
                SK: 'INFO'
            }
        };
        
        const result = await dynamodb.get(params).promise();
        
        if (!result.Item) {
            return createResponse(404, { 
                error: '사찰을 찾을 수 없습니다',
                templeId 
            });
        }
        
        return createResponse(200, {
            temple: formatTempleResponse(result.Item)
        });
        
    } catch (error) {
        return handleError(error, 'getTemple');
    }
}

// ➕ 새 사찰 생성
async function createTemple(templeData) {
    try {
        validateTempleData(templeData);
        
        const templeId = generateTempleId(templeData.name);
        const timestamp = new Date().toISOString();
        
        const temple = {
            PK: `TEMPLE#${templeId}`,
            SK: 'INFO',
            templeId,
            name: templeData.name,
            fullName: templeData.fullName || templeData.name,
            address: templeData.address,
            city: templeData.city,
            province: templeData.province,
            denomination: templeData.denomination || 'jogye',
            description: templeData.description || '',
            features: templeData.features || [],
            images: templeData.images || [],
            rating: 0,
            reviewCount: 0,
            location: templeData.location || null,
            createdAt: timestamp,
            updatedAt: timestamp,
            
            // GSI 키들
            GSI1PK: `CITY#${templeData.city}`,
            GSI1SK: `RATING#${String(0).padStart(3, '0')}`,
            GSI2PK: `PROVINCE#${templeData.province}`,
            GSI2SK: `NAME#${templeData.name}`
        };
        
        const params = {
            TableName: TABLE_NAME,
            Item: temple,
            ConditionExpression: 'attribute_not_exists(PK)'
        };
        
        await dynamodb.put(params).promise();
        
        return createResponse(201, {
            message: '사찰이 성공적으로 등록되었습니다',
            temple: formatTempleResponse(temple)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(409, { 
                error: '이미 존재하는 사찰입니다' 
            });
        }
        return handleError(error, 'createTemple');
    }
}

// ✏️ 사찰 정보 업데이트
async function updateTemple(templeId, updateData) {
    try {
        const timestamp = new Date().toISOString();
        
        // 업데이트 가능한 필드만 필터링
        const allowedFields = [
            'name', 'fullName', 'address', 'city', 'province',
            'denomination', 'description', 'features', 'images', 'location'
        ];
        
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
                SK: 'INFO'
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
            ConditionExpression: 'attribute_exists(PK)'
        };
        
        const result = await dynamodb.update(params).promise();
        
        return createResponse(200, {
            message: '사찰 정보가 업데이트되었습니다',
            temple: formatTempleResponse(result.Attributes)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(404, { 
                error: '사찰을 찾을 수 없습니다' 
            });
        }
        return handleError(error, 'updateTemple');
    }
}

// 🗑️ 사찰 삭제
async function deleteTemple(templeId) {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `TEMPLE#${templeId}`,
                SK: 'INFO'
            },
            ConditionExpression: 'attribute_exists(PK)',
            ReturnValues: 'ALL_OLD'
        };
        
        const result = await dynamodb.delete(params).promise();
        
        return createResponse(200, {
            message: '사찰이 삭제되었습니다',
            deletedTemple: formatTempleResponse(result.Attributes)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(404, { 
                error: '사찰을 찾을 수 없습니다' 
            });
        }
        return handleError(error, 'deleteTemple');
    }
}

// 🔧 헬퍼 함수들

// 사찰 ID 생성 (한글 → 영문 변환)
function generateTempleId(name) {
    const koreanToEnglish = {
        '조계': 'jogye',
        '봉은': 'bongeun',
        '불국': 'bulguk',
        '해인': 'haein',
        '송광': 'songgwang'
    };
    
    const simplified = Object.keys(koreanToEnglish)
        .reduce((name, korean) => 
            name.replace(korean, koreanToEnglish[korean]), name);
    
    return simplified.toLowerCase()
        .replace(/[^a-z0-9]/g, '') + 
        '-' + Date.now().toString(36);
}

// 응답 데이터 포맷팅
function formatTempleResponse(item) {
    if (!item) return null;
    
    // DynamoDB 내부 필드 제거
    const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...temple } = item;
    
    return {
        ...temple,
        rating: Number(temple.rating || 0),
        reviewCount: Number(temple.reviewCount || 0),
        features: temple.features || [],
        images: temple.images || []
    };
}

// 거리 계산 (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 지구 반지름 (km)
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}