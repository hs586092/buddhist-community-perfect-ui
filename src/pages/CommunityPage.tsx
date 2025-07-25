import React, { useState, useRef, useEffect } from 'react';
import { topics, messages, users, currentUser } from '../data/community';
import { Message, Topic, User } from '../types/community';

const CommunityPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>(messages);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      author: currentUser,
      content: messageText,
      timestamp: new Date().toISOString(),
      type: 'text',
      replyTo: replyingTo?.id,
      reactions: []
    };

    setChatMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setReplyingTo(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser.id)) {
            // 이미 반응했으면 제거
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== currentUser.id) }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // 반응 추가
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, currentUser.id] }
                  : r
              )
            };
          }
        } else {
          // 새로운 반응 추가
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1, users: [currentUser.id] }]
          };
        }
      }
      return msg;
    }));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const onlineUsers = users.filter(u => u.isOnline);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            💬 불자 소통
          </h1>
          <p className="text-lg text-gray-600">
            불자들이 마음을 나누고 지혜를 함께 키워가는 평화로운 공간
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 - 토픽 목록 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">대화 주제</h3>
              <div className="space-y-2">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTopic.id === topic.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{topic.emoji}</span>
                      <span className="font-medium text-gray-900">{topic.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{topic.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>💬 {topic.messageCount}</span>
                      <span>👥 {topic.onlineUsers}명 접속</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 온라인 사용자 목록 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                접속 중인 불자들 ({onlineUsers.length}명)
              </h3>
              <div className="space-y-2">
                {onlineUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">{user.avatar}</span>
                    </div>
                    <span className="text-sm text-gray-700">{user.nickname}</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 메인 채팅 영역 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex flex-col">
              {/* 채팅 헤더 */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedTopic.emoji}</span>
                  <h2 className="font-semibold text-gray-900">{selectedTopic.title}</h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${selectedTopic.color}`}>
                    {selectedTopic.onlineUsers}명 참여중
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{selectedTopic.description}</p>
              </div>

              {/* 메시지 목록 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map(message => (
                  <div key={message.id} className="group">
                    {/* 답글 표시 */}
                    {message.replyTo && (
                      <div className="ml-8 mb-2 text-xs text-gray-500 border-l-2 border-gray-200 pl-3">
                        답글: {chatMessages.find(m => m.id === message.replyTo)?.content.slice(0, 50)}...
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">{message.author.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{message.author.nickname}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            message.author.level === '초심자' ? 'bg-green-100 text-green-800' :
                            message.author.level === '수행자' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {message.author.level}
                          </span>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
                        
                        {/* 반응 및 액션 */}
                        <div className="flex items-center gap-2 mt-2">
                          {/* 기존 반응들 */}
                          {message.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              onClick={() => addReaction(message.id, reaction.emoji)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                                reaction.users.includes(currentUser.id)
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.count}</span>
                            </button>
                          ))}
                          
                          {/* 반응 추가 버튼 */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            {['🙏', '👍', '💪', '😌', '✨'].map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(message.id, emoji)}
                                className="text-xs hover:bg-gray-100 rounded px-1 py-1"
                              >
                                {emoji}
                              </button>
                            ))}
                            <button
                              onClick={() => setReplyingTo(message)}
                              className="text-xs text-gray-500 hover:text-gray-700 px-1"
                            >
                              답글
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* 메시지 입력 */}
              <div className="p-4 border-t border-gray-200">
                {replyingTo && (
                  <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{replyingTo.author.nickname}</span>님에게 답글: 
                      <span className="ml-1">{replyingTo.content.slice(0, 50)}...</span>
                    </div>
                    <button 
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="따뜻한 마음으로 메시지를 입력하세요..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    전송
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Enter로 전송, Shift+Enter로 줄바꿈
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;