// 💬 실시간 채팅 WebSocket Lambda 함수
// WebSocket API Gateway와 연동하여 실시간 불자 소통 구현

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const MESSAGES_TABLE = process.env.MESSAGES_TABLE || 'BuddhistCommunity-Messages';
const SESSIONS_TABLE = process.env.SESSIONS_TABLE || 'BuddhistCommunity-Sessions';
const WEBSOCKET_ENDPOINT = process.env.WEBSOCKET_ENDPOINT;

// API Gateway Management API 클라이언트
const apiGatewayManager = new AWS.ApiGatewayManagementApi({
    endpoint: WEBSOCKET_ENDPOINT
});

// 응답 헬퍼 함수
const createResponse = (statusCode, body = {}) => ({
    statusCode,
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

// 메시지 검증
const validateMessageData = (data) => {
    const required = ['content', 'messageType', 'roomId'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
        throw new Error(`필수 필드가 누락되었습니다: ${missing.join(', ')}`);
    }
    
    const validTypes = ['question', 'sharing', 'advice', 'discussion', 'meditation'];
    if (!validTypes.includes(data.messageType)) {
        throw new Error(`유효하지 않은 메시지 타입입니다. 사용 가능: ${validTypes.join(', ')}`);
    }
    
    const validRooms = ['general', 'meditation', 'dharma', 'beginners', 'temple-reviews'];
    if (!validRooms.includes(data.roomId)) {
        throw new Error(`유효하지 않은 방입니다. 사용 가능: ${validRooms.join(', ')}`);
    }
    
    if (data.content.length > 1000) {
        throw new Error('메시지는 1000자 이하여야 합니다');
    }
    
    return true;
};

exports.handler = async (event) => {
    console.log('WebSocket Event:', JSON.stringify(event, null, 2));
    
    const { requestContext } = event;
    const { connectionId, routeKey, authorizer } = requestContext;
    const userId = authorizer?.userId || 'anonymous';
    
    try {
        switch (routeKey) {
            case '$connect':
                return await handleConnect(connectionId, userId, event);
                
            case '$disconnect':
                return await handleDisconnect(connectionId, userId);
                
            case 'sendMessage':
                const messageData = JSON.parse(event.body || '{}');
                return await handleSendMessage(connectionId, userId, messageData);
                
            case 'joinRoom':
                const joinData = JSON.parse(event.body || '{}');
                return await handleJoinRoom(connectionId, userId, joinData.roomId);
                
            case 'leaveRoom':
                const leaveData = JSON.parse(event.body || '{}');
                return await handleLeaveRoom(connectionId, userId, leaveData.roomId);
                
            case 'typing':
                const typingData = JSON.parse(event.body || '{}');
                return await handleTyping(connectionId, userId, typingData);
                
            case 'getMessages':
                const historyData = JSON.parse(event.body || '{}');
                return await handleGetMessages(connectionId, userId, historyData);
                
            default:
                return createResponse(400, { error: '알 수 없는 라우트입니다' });
        }
        
    } catch (error) {
        return handleError(error, `Route: ${routeKey}`);
    }
};

// 🔗 WebSocket 연결 처리
async function handleConnect(connectionId, userId, event) {
    try {
        const timestamp = new Date().toISOString();
        const queryParams = event.queryStringParameters || {};
        const roomId = queryParams.room || 'general';
        const username = queryParams.username || `불자${userId.slice(-4)}`;
        
        // 세션 정보 저장
        const session = {
            PK: `SESSION#${connectionId}`,
            SK: 'INFO',
            sessionId: connectionId,
            userId,
            username,
            roomId,
            status: 'connected',
            lastActivity: timestamp,
            isOnline: true,
            
            // GSI for room-based queries
            GSI1PK: `ROOM#${roomId}`,
            GSI1SK: `LAST_ACTIVITY#${timestamp}`,
            
            // TTL: 1시간 후 자동 삭제
            ttl: Math.floor(Date.now() / 1000) + (60 * 60)
        };
        
        await dynamodb.put({
            TableName: SESSIONS_TABLE,
            Item: session
        }).promise();
        
        // 방 참여 알림 (다른 사용자들에게)
        await broadcastToRoom(roomId, {
            type: 'user_joined',
            userId,
            username,
            timestamp,
            message: `${username}님이 입장하셨습니다 🙏`
        }, connectionId);
        
        // 환영 메시지 전송
        await sendToConnection(connectionId, {
            type: 'welcome',
            message: `선원에 오신 것을 환영합니다, ${username}님 🪷`,
            roomId,
            timestamp
        });
        
        // 현재 방의 온라인 사용자 목록 전송
        const onlineUsers = await getRoomUsers(roomId);
        await sendToConnection(connectionId, {
            type: 'online_users',
            users: onlineUsers,
            roomId
        });
        
        return createResponse(200, { message: 'Connected successfully' });
        
    } catch (error) {
        return handleError(error, 'handleConnect');
    }
}

// 🔌 WebSocket 연결 해제 처리
async function handleDisconnect(connectionId, userId) {
    try {
        // 세션 정보 조회
        const sessionResult = await dynamodb.get({
            TableName: SESSIONS_TABLE,
            Key: {
                PK: `SESSION#${connectionId}`,
                SK: 'INFO'
            }
        }).promise();
        
        if (sessionResult.Item) {
            const { roomId, username } = sessionResult.Item;
            
            // 세션 삭제
            await dynamodb.delete({
                TableName: SESSIONS_TABLE,
                Key: {
                    PK: `SESSION#${connectionId}`,
                    SK: 'INFO'
                }
            }).promise();
            
            // 방 떠남 알림
            await broadcastToRoom(roomId, {
                type: 'user_left',
                userId,
                username,
                timestamp: new Date().toISOString(),
                message: `${username}님이 퇴장하셨습니다`
            }, connectionId);
        }
        
        return createResponse(200, { message: 'Disconnected successfully' });
        
    } catch (error) {
        return handleError(error, 'handleDisconnect');
    }
}

// 💬 메시지 전송 처리
async function handleSendMessage(connectionId, userId, messageData) {
    try {
        validateMessageData(messageData);
        
        const messageId = generateMessageId();
        const timestamp = new Date().toISOString();
        
        // 메시지 저장
        const message = {
            PK: `ROOM#${messageData.roomId}`,
            SK: `MESSAGE#${timestamp}#${messageId}`,
            messageId,
            roomId: messageData.roomId,
            userId,
            content: messageData.content,
            messageType: messageData.messageType,
            isAnonymous: messageData.isAnonymous || false,
            reactions: {},
            timestamp,
            
            // TTL: 30일 후 자동 삭제
            ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
            
            // GSI for user message history
            GSI1PK: `USER#${userId}`,
            GSI1SK: `TIMESTAMP#${timestamp}`
        };
        
        await dynamodb.put({
            TableName: MESSAGES_TABLE,
            Item: message
        }).promise();
        
        // 사용자 정보 조회
        const sessionResult = await dynamodb.get({
            TableName: SESSIONS_TABLE,
            Key: {
                PK: `SESSION#${connectionId}`,
                SK: 'INFO'
            }
        }).promise();
        
        const username = sessionResult.Item?.username || `불자${userId.slice(-4)}`;
        
        // 방의 모든 사용자에게 메시지 브로드캐스트
        const broadcastMessage = {
            type: 'new_message',
            message: {
                ...formatMessageResponse(message),
                username: messageData.isAnonymous ? '익명' : username
            }
        };
        
        await broadcastToRoom(messageData.roomId, broadcastMessage);
        
        return createResponse(200, { 
            message: 'Message sent successfully',
            messageId 
        });
        
    } catch (error) {
        // 에러를 연결자에게 직접 전송
        await sendToConnection(connectionId, {
            type: 'error',
            error: error.message
        });
        return handleError(error, 'handleSendMessage');
    }
}

// 🚪 방 참여 처리
async function handleJoinRoom(connectionId, userId, roomId) {
    try {
        const timestamp = new Date().toISOString();
        
        // 현재 세션 업데이트
        await dynamodb.update({
            TableName: SESSIONS_TABLE,
            Key: {
                PK: `SESSION#${connectionId}`,
                SK: 'INFO'
            },
            UpdateExpression: 'SET roomId = :roomId, lastActivity = :timestamp, GSI1PK = :roomKey, GSI1SK = :activityKey',
            ExpressionAttributeValues: {
                ':roomId': roomId,
                ':timestamp': timestamp,
                ':roomKey': `ROOM#${roomId}`,
                ':activityKey': `LAST_ACTIVITY#${timestamp}`
            }
        }).promise();
        
        // 최근 메시지 조회
        const recentMessages = await getRecentMessages(roomId, 20);
        
        // 방 정보와 최근 메시지 전송
        await sendToConnection(connectionId, {
            type: 'room_joined',
            roomId,
            recentMessages
        });
        
        // 온라인 사용자 목록 전송
        const onlineUsers = await getRoomUsers(roomId);
        await sendToConnection(connectionId, {
            type: 'online_users',
            users: onlineUsers,
            roomId
        });
        
        return createResponse(200, { message: 'Joined room successfully' });
        
    } catch (error) {
        return handleError(error, 'handleJoinRoom');
    }
}

// 🚪 방 떠나기 처리
async function handleLeaveRoom(connectionId, userId, roomId) {
    try {
        // 기본 방(general)으로 이동
        const newRoomId = 'general';
        const timestamp = new Date().toISOString();
        
        await dynamodb.update({
            TableName: SESSIONS_TABLE,
            Key: {
                PK: `SESSION#${connectionId}`,
                SK: 'INFO'
            },
            UpdateExpression: 'SET roomId = :roomId, lastActivity = :timestamp, GSI1PK = :roomKey, GSI1SK = :activityKey',
            ExpressionAttributeValues: {
                ':roomId': newRoomId,
                ':timestamp': timestamp,
                ':roomKey': `ROOM#${newRoomId}`,
                ':activityKey': `LAST_ACTIVITY#${timestamp}`
            }
        }).promise();
        
        await sendToConnection(connectionId, {
            type: 'room_left',
            leftRoomId: roomId,
            currentRoomId: newRoomId
        });
        
        return createResponse(200, { message: 'Left room successfully' });
        
    } catch (error) {
        return handleError(error, 'handleLeaveRoom');
    }
}

// ⌨️ 타이핑 상태 처리
async function handleTyping(connectionId, userId, typingData) {
    try {
        const { roomId, isTyping } = typingData;
        
        // 세션 정보 조회
        const sessionResult = await dynamodb.get({
            TableName: SESSIONS_TABLE,
            Key: {
                PK: `SESSION#${connectionId}`,
                SK: 'INFO'
            }
        }).promise();
        
        if (!sessionResult.Item) {
            return createResponse(404, { error: 'Session not found' });
        }
        
        const { username } = sessionResult.Item;
        
        // 타이핑 상태를 같은 방의 다른 사용자들에게 브로드캐스트
        await broadcastToRoom(roomId, {
            type: 'typing_status',
            userId,
            username,
            isTyping,
            timestamp: new Date().toISOString()
        }, connectionId); // 본인은 제외
        
        return createResponse(200, { message: 'Typing status updated' });
        
    } catch (error) {
        return handleError(error, 'handleTyping');
    }
}

// 📜 메시지 히스토리 조회
async function handleGetMessages(connectionId, userId, historyData) {
    try {
        const { roomId, limit = 50, lastKey } = historyData;
        
        let params = {
            TableName: MESSAGES_TABLE,
            KeyConditionExpression: 'PK = :roomKey',
            ExpressionAttributeValues: {
                ':roomKey': `ROOM#${roomId}`
            },
            Limit: parseInt(limit),
            ScanIndexForward: false // 최신순
        };
        
        if (lastKey) {
            params.ExclusiveStartKey = JSON.parse(lastKey);
        }
        
        const result = await dynamodb.query(params).promise();
        const messages = result.Items.map(formatMessageResponse).reverse(); // 시간순으로 정렬
        
        await sendToConnection(connectionId, {
            type: 'message_history',
            roomId,
            messages,
            lastKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : null
        });
        
        return createResponse(200, { message: 'Message history sent' });
        
    } catch (error) {
        return handleError(error, 'handleGetMessages');
    }
}

// 🔧 헬퍼 함수들

// 특정 연결에 메시지 전송
async function sendToConnection(connectionId, data) {
    try {
        await apiGatewayManager.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(data)
        }).promise();
    } catch (error) {
        if (error.statusCode === 410) {
            console.log(`Connection ${connectionId} is no longer available`);
            // 연결이 끊어진 경우 세션 정리
            await cleanupSession(connectionId);
        } else {
            console.error(`Failed to send to connection ${connectionId}:`, error);
        }
    }
}

// 방의 모든 사용자에게 브로드캐스트
async function broadcastToRoom(roomId, data, excludeConnectionId = null) {
    try {
        // 방의 모든 활성 세션 조회
        const result = await dynamodb.query({
            TableName: SESSIONS_TABLE,
            IndexName: 'GSI1-Room-Activity',
            KeyConditionExpression: 'GSI1PK = :roomKey',
            ExpressionAttributeValues: {
                ':roomKey': `ROOM#${roomId}`
            }
        }).promise();
        
        const sessions = result.Items;
        
        // 각 세션에 메시지 전송
        const sendPromises = sessions
            .filter(session => session.sessionId !== excludeConnectionId)
            .map(session => sendToConnection(session.sessionId, data));
        
        await Promise.allSettled(sendPromises);
        
    } catch (error) {
        console.error('Error broadcasting to room:', error);
    }
}

// 방의 온라인 사용자 목록 조회
async function getRoomUsers(roomId) {
    try {
        const result = await dynamodb.query({
            TableName: SESSIONS_TABLE,
            IndexName: 'GSI1-Room-Activity',
            KeyConditionExpression: 'GSI1PK = :roomKey',
            ExpressionAttributeValues: {
                ':roomKey': `ROOM#${roomId}`
            }
        }).promise();
        
        return result.Items.map(session => ({
            userId: session.userId,
            username: session.username,
            status: session.status,
            lastActivity: session.lastActivity
        }));
        
    } catch (error) {
        console.error('Error getting room users:', error);
        return [];
    }
}

// 최근 메시지 조회
async function getRecentMessages(roomId, limit = 20) {
    try {
        const result = await dynamodb.query({
            TableName: MESSAGES_TABLE,
            KeyConditionExpression: 'PK = :roomKey',
            ExpressionAttributeValues: {
                ':roomKey': `ROOM#${roomId}`
            },
            Limit: limit,
            ScanIndexForward: false // 최신순
        }).promise();
        
        return result.Items.map(formatMessageResponse).reverse(); // 시간순으로 정렬
        
    } catch (error) {
        console.error('Error getting recent messages:', error);
        return [];
    }
}

// 세션 정리
async function cleanupSession(connectionId) {
    try {
        await dynamodb.delete({
            TableName: SESSIONS_TABLE,
            Key: {
                PK: `SESSION#${connectionId}`,
                SK: 'INFO'
            }
        }).promise();
    } catch (error) {
        console.error('Error cleaning up session:', error);
    }
}

// 메시지 ID 생성
function generateMessageId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// 메시지 응답 포맷팅
function formatMessageResponse(item) {
    if (!item) return null;
    
    // DynamoDB 내부 필드 제거
    const { PK, SK, GSI1PK, GSI1SK, ttl, ...message } = item;
    
    return {
        ...message,
        reactions: message.reactions || {}
    };
}