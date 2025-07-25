/**
 * WhatsApp-style Confirmation Flow
 *
 * Features:
 * - Chat-like messaging interface
 * - Progressive message reveals
 * - Typing indicators and read receipts
 * - QR code sharing for calendar
 * - Social sharing options
 * - Reminder setup interface
 * - Beautiful confirmation animations
 */

import { format, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import type { EventDetails, EventRegistrationData } from '../../types/event-registration';

interface WhatsAppConfirmationProps {
  eventDetails: EventDetails;
  registrationData: EventRegistrationData;
  onClose: () => void;
  onShareEvent?: () => void;
  onAddToCalendar?: () => void;
  onSetupReminders?: (settings: any) => void;
}

interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string | React.ReactNode;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  delay?: number;
}

export const WhatsAppConfirmation: React.FC<WhatsAppConfirmationProps> = ({
  eventDetails,
  registrationData,
  onClose,
  onShareEvent,
  onAddToCalendar,
  onSetupReminders,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Define the confirmation flow messages
  const messageFlow: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>[] = [
    {
      type: 'system',
      content: 'Registration Confirmed ✨',
      delay: 500,
    },
    {
      type: 'bot',
      content: `🙏 Wonderful! You're now registered for "${eventDetails.title}"`,
      delay: 1000,
    },
    {
      type: 'bot',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <div>
              <div className="font-medium">
                {format(parseISO(eventDetails.schedule.startDate), 'EEEE, MMMM do')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {format(parseISO(eventDetails.schedule.startDate), 'h:mm a')} -
                {format(parseISO(eventDetails.schedule.endDate), 'h:mm a')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <div>
              <div className="font-medium">{eventDetails.location.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {eventDetails.location.address}
              </div>
            </div>
          </div>
        </div>
      ),
      delay: 2000,
    },
    {
      type: 'bot',
      content: `A confirmation email has been sent to ${registrationData.personalInfo.email}`,
      delay: 3500,
    },
    {
      type: 'bot',
      content: 'Would you like me to help you with anything else?',
      delay: 4500,
    },
  ];

  // Initialize message flow
  useEffect(() => {
    messageFlow.forEach((msg, index) => {
      setTimeout(() => {
        if (index < messageFlow.length - 1) {
          setIsTyping(true);
        }

        setTimeout(() => {
          setIsTyping(false);

          const newMessage: ChatMessage = {
            ...msg,
            id: `msg-${index}`,
            timestamp: new Date(),
            status: 'delivered',
          };

          setMessages(prev => [...prev, newMessage]);

          // Show actions after last message
          if (index === messageFlow.length - 1) {
            setTimeout(() => setShowActions(true), 1000);
          }
        }, msg.delay ? 1500 : 500); // Typing delay
      }, msg.delay || 0);
    });
  }, []);

  // Handle user actions
  const handleUserAction = (action: string, content: string) => {
    setUserInteracted(true);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, userMessage]);

    // Bot response based on action
    setTimeout(() => {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        let botResponse = '';
        switch (action) {
          case 'calendar':
            botResponse = '📅 Perfect! I\'ve prepared a calendar event for you. Check your downloads!';
            onAddToCalendar?.();
            break;
          case 'share':
            botResponse = '📱 Great choice! Sharing this beautiful dharma gathering with others.';
            onShareEvent?.();
            break;
          case 'reminders':
            botResponse = '⏰ Smart thinking! I\'ll help you set up reminders so you don\'t miss this special event.';
            onSetupReminders?.({
              email: true,
              sms: false,
              push: true,
              timesBefore: ['1week', '1day', '1hour']
            });
            break;
          case 'thanks':
            botResponse = '🙏 The pleasure is mine! May this dharma gathering bring you peace and insight. See you there! ✨';
            setTimeout(() => onClose(), 3000);
            break;
        }

        const botMessage: ChatMessage = {
          id: `bot-response-${Date.now()}`,
          type: 'bot',
          content: botResponse,
          timestamp: new Date(),
          status: 'delivered',
        };

        setMessages(prev => [...prev, botMessage]);
      }, 1500);
    }, 300);
  };

  // Generate QR code data
  const generateCalendarQR = () => {
    const eventData = {
      title: eventDetails.title,
      start: eventDetails.schedule.startDate,
      end: eventDetails.schedule.endDate,
      location: eventDetails.location.address,
      description: eventDetails.description,
    };

    return `data:calendar,${encodeURIComponent(JSON.stringify(eventData))}`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🪷</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Dharma Assistant</h3>
              <div className="flex items-center gap-1 text-sm opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🪷</span>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-2 shadow-sm">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-2 gap-2">
                <ActionButton
                  icon="📅"
                  label="Add to Calendar"
                  onClick={() => handleUserAction('calendar', 'Add to my calendar please')}
                />
                <ActionButton
                  icon="📱"
                  label="Share Event"
                  onClick={() => handleUserAction('share', 'Share this event')}
                />
                <ActionButton
                  icon="⏰"
                  label="Set Reminders"
                  onClick={() => handleUserAction('reminders', 'Set up reminders for me')}
                />
                <ActionButton
                  icon="🙏"
                  label="All Good!"
                  onClick={() => handleUserAction('thanks', 'Thank you, that\'s all!')}
                  variant="primary"
                />
              </div>

              {/* Quick QR Code */}
              <motion.div
                className="text-center pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Scan to add to calendar
                </div>
                <div className="inline-block p-2 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs">QR</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      {!isUser && (
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">🪷</span>
        </div>
      )}

      <div
        className={`max-w-xs rounded-2xl px-4 py-2 shadow-sm ${
          isUser
            ? 'bg-purple-500 text-white rounded-br-md'
            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
        }`}
      >
        <div className="text-sm">{message.content}</div>
        <div className={`text-xs mt-1 ${isUser ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {format(message.timestamp, 'HH:mm')}
          {isUser && (
            <span className="ml-1">
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && '✓✓'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Action Button Component
const ActionButton: React.FC<{
  icon: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
}> = ({ icon, label, onClick, variant = 'default' }) => {
  return (
    <motion.button
      className={`p-3 rounded-xl text-sm font-medium transition-all ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
    </motion.button>
  );
};
