// 👤 사용자 관리 Lambda 함수
// DynamoDB와 Cognito 연동하여 사용자 정보를 관리

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'BuddhistCommunity-Users';
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
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
const validateUserData = (data) => {
    const required = ['username', 'email'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
        throw new Error(`필수 필드가 누락되었습니다: ${missing.join(', ')}`);
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('올바른 이메일 형식이 아닙니다');
    }
    
    // 불교 수행 레벨 검증
    const validLevels = ['입문자', '수행자', '오랜불자'];
    if (data.buddhistLevel && !validLevels.includes(data.buddhistLevel)) {
        throw new Error(`유효하지 않은 불교 수행 레벨입니다. 사용 가능: ${validLevels.join(', ')}`);
    }
    
    return true;
};

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { httpMethod, pathParameters, queryStringParameters, body, requestContext } = event;
    const userId = pathParameters?.userId;
    const cognitoUserId = requestContext?.authorizer?.claims?.sub;
    
    try {
        // OPTIONS 요청 (CORS preflight)
        if (httpMethod === 'OPTIONS') {
            return createResponse(200, { message: 'CORS preflight' });
        }

        // 인증 확인 (필요한 경우)
        if (httpMethod !== 'GET' && !cognitoUserId && !userId) {
            return createResponse(401, { error: '인증이 필요합니다' });
        }

        // 라우팅
        switch (httpMethod) {
            case 'GET':
                if (userId) {
                    return await getUser(userId);
                } else if (queryStringParameters?.search) {
                    return await searchUsers(queryStringParameters);
                } else {
                    return await listUsers(queryStringParameters);
                }
                
            case 'POST':
                return await createUser(JSON.parse(body || '{}'), cognitoUserId);
                
            case 'PUT':
                if (!userId) {
                    return createResponse(400, { error: '사용자 ID가 필요합니다' });
                }
                return await updateUser(userId, JSON.parse(body || '{}'), cognitoUserId);
                
            case 'DELETE':
                if (!userId) {
                    return createResponse(400, { error: '사용자 ID가 필요합니다' });
                }
                return await deleteUser(userId, cognitoUserId);
                
            default:
                return createResponse(405, { error: '지원하지 않는 HTTP 메서드입니다' });
        }
        
    } catch (error) {
        return handleError(error, 'Main handler');
    }
};

// 👤 사용자 목록 조회
async function listUsers(queryParams = {}) {
    try {
        const { limit = 20, lastKey, buddhistLevel, isOnline } = queryParams;
        
        let params = {
            TableName: TABLE_NAME,
            Limit: parseInt(limit)
        };
        
        // 불교 수행 레벨별 필터링
        if (buddhistLevel) {
            params.IndexName = 'GSI1-BuddhistLevel-Created';
            params.KeyConditionExpression = 'GSI1PK = :level';
            params.ExpressionAttributeValues = {
                ':level': `BUDDHIST_LEVEL#${buddhistLevel}`
            };
            params.ScanIndexForward = false; // 최신 가입 순
        } else {
            // 전체 스캔
            params.FilterExpression = 'attribute_exists(username)';
        }
        
        // 온라인 상태 필터링
        if (isOnline === 'true') {
            const currentTime = Date.now();
            const fiveMinutesAgo = currentTime - (5 * 60 * 1000);
            
            if (params.FilterExpression) {
                params.FilterExpression += ' AND lastLoginAt > :recentTime';
            } else {
                params.FilterExpression = 'lastLoginAt > :recentTime';
            }
            
            params.ExpressionAttributeValues = {
                ...params.ExpressionAttributeValues,
                ':recentTime': fiveMinutesAgo.toString()
            };
        }
        
        // 페이지네이션
        if (lastKey) {
            params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
        }
        
        const result = buddhistLevel 
            ? await dynamodb.query(params).promise()
            : await dynamodb.scan(params).promise();
        
        // 응답 데이터 정리 (민감한 정보 제거)
        const users = result.Items.map(formatUserResponse);
        
        const response = {
            users,
            totalCount: users.length,
            lastKey: result.LastEvaluatedKey ? 
                encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
        };
        
        return createResponse(200, response);
        
    } catch (error) {
        return handleError(error, 'listUsers');
    }
}

// 🔍 사용자 검색
async function searchUsers(queryParams) {
    try {
        const { search, limit = 10 } = queryParams;
        
        if (!search || search.length < 2) {
            return createResponse(400, { 
                error: '검색어는 2글자 이상이어야 합니다' 
            });
        }
        
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'contains(username, :search) OR contains(email, :search)',
            ExpressionAttributeValues: {
                ':search': search
            },
            Limit: parseInt(limit)
        };
        
        const result = await dynamodb.scan(params).promise();
        const users = result.Items.map(formatUserResponse);
        
        return createResponse(200, {
            users,
            searchTerm: search,
            totalCount: users.length
        });
        
    } catch (error) {
        return handleError(error, 'searchUsers');
    }
}

// 👤 단일 사용자 조회
async function getUser(userId) {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `USER#${userId}`,
                SK: 'PROFILE'
            }
        };
        
        const result = await dynamodb.get(params).promise();
        
        if (!result.Item) {
            return createResponse(404, { 
                error: '사용자를 찾을 수 없습니다',
                userId 
            });
        }
        
        return createResponse(200, {
            user: formatUserResponse(result.Item)
        });
        
    } catch (error) {
        return handleError(error, 'getUser');
    }
}

// ➕ 새 사용자 생성
async function createUser(userData, cognitoUserId) {
    try {
        validateUserData(userData);
        
        const userId = cognitoUserId || generateUserId(userData.username);
        const timestamp = new Date().toISOString();
        
        const user = {
            PK: `USER#${userId}`,
            SK: 'PROFILE',
            userId,
            username: userData.username,
            email: userData.email,
            buddhistLevel: userData.buddhistLevel || '입문자',
            isAnonymous: userData.isAnonymous || false,
            avatar: userData.avatar || null,
            preferences: userData.preferences || {
                notifications: true,
                emailUpdates: false,
                anonymousPosting: false
            },
            createdAt: timestamp,
            lastLoginAt: timestamp,
            
            // GSI 키들
            GSI1PK: `BUDDHIST_LEVEL#${userData.buddhistLevel || '입문자'}`,
            GSI1SK: `CREATED#${timestamp}`
        };
        
        const params = {
            TableName: TABLE_NAME,
            Item: user,
            ConditionExpression: 'attribute_not_exists(PK)'
        };
        
        await dynamodb.put(params).promise();
        
        return createResponse(201, {
            message: '사용자가 성공적으로 등록되었습니다',
            user: formatUserResponse(user)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(409, { 
                error: '이미 존재하는 사용자입니다' 
            });
        }
        return handleError(error, 'createUser');
    }
}

// ✏️ 사용자 정보 업데이트
async function updateUser(userId, updateData, cognitoUserId) {
    try {
        // 권한 확인 (본인만 수정 가능)
        if (cognitoUserId && userId !== cognitoUserId) {
            return createResponse(403, { 
                error: '본인의 정보만 수정할 수 있습니다' 
            });
        }
        
        const timestamp = new Date().toISOString();
        
        // 업데이트 가능한 필드만 필터링
        const allowedFields = [
            'username', 'buddhistLevel', 'isAnonymous', 'avatar', 'preferences'
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
            .join(', ') + ', updatedAt = :timestamp, lastLoginAt = :timestamp';
        
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
                SK: 'PROFILE'
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
            ConditionExpression: 'attribute_exists(PK)'
        };
        
        const result = await dynamodb.update(params).promise();
        
        return createResponse(200, {
            message: '사용자 정보가 업데이트되었습니다',
            user: formatUserResponse(result.Attributes)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(404, { 
                error: '사용자를 찾을 수 없습니다' 
            });
        }
        return handleError(error, 'updateUser');
    }
}

// 🗑️ 사용자 삭제 (비활성화)
async function deleteUser(userId, cognitoUserId) {
    try {
        // 권한 확인 (본인만 삭제 가능)
        if (cognitoUserId && userId !== cognitoUserId) {
            return createResponse(403, { 
                error: '본인의 계정만 삭제할 수 있습니다' 
            });
        }
        
        const timestamp = new Date().toISOString();
        
        // 완전 삭제가 아닌 비활성화 처리
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `USER#${userId}`,
                SK: 'PROFILE'
            },
            UpdateExpression: 'SET isActive = :false, deletedAt = :timestamp',
            ExpressionAttributeValues: {
                ':false': false,
                ':timestamp': timestamp
            },
            ReturnValues: 'ALL_NEW',
            ConditionExpression: 'attribute_exists(PK)'
        };
        
        const result = await dynamodb.update(params).promise();
        
        return createResponse(200, {
            message: '계정이 비활성화되었습니다',
            user: formatUserResponse(result.Attributes)
        });
        
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return createResponse(404, { 
                error: '사용자를 찾을 수 없습니다' 
            });
        }
        return handleError(error, 'deleteUser');
    }
}

// 🔧 헬퍼 함수들

// 사용자 ID 생성
function generateUserId(username) {
    return username.toLowerCase()
        .replace(/[^a-z0-9]/g, '') + 
        '-' + Date.now().toString(36);
}

// 응답 데이터 포맷팅 (민감한 정보 제거)
function formatUserResponse(item) {
    if (!item) return null;
    
    // DynamoDB 내부 필드 및 민감한 정보 제거
    const { PK, SK, GSI1PK, GSI1SK, email, ...user } = item;
    
    return {
        ...user,
        // 이메일은 마스킹 처리
        emailMasked: email ? maskEmail(email) : null,
        isOnline: isUserOnline(user.lastLoginAt)
    };
}

// 이메일 마스킹
function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.length > 2 
        ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
        : localPart;
    return `${maskedLocal}@${domain}`;
}

// 온라인 상태 확인 (5분 이내 활동)
function isUserOnline(lastLoginAt) {
    if (!lastLoginAt) return false;
    const lastLogin = new Date(lastLoginAt).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return (now - lastLogin) < fiveMinutes;
}