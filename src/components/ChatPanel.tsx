import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatPanelProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  travelPlan: any;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onSubmit, isLoading, travelPlan }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([
    {
      id: '1',
      content: "Hi! I'm your AI fashion stylist. I can help you with outfits for travel or special events. Just let me know what you need!",
      type: 'assistant',
      timestamp: new Date()
    }
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (travelPlan) {
      let newMessage = '';

      if (travelPlan.status === 'success') {
        if (travelPlan.type === 'travel') {
          newMessage = `Here are your outfit suggestions for ${travelPlan.destination} on ${new Date(travelPlan.date).toLocaleDateString()}. I've checked the weather and found some great options for you!`;
        } else if (travelPlan.type === 'event') {
          newMessage = `Here are your outfit suggestions for the ${travelPlan.event}. I've curated some perfect looks for the occasion!`;
        }
      } else if (travelPlan.status === 'warning') {
        newMessage = `I found outfit suggestions for ${travelPlan.destination}, but please note: ${travelPlan.warning}`;
      } else if (travelPlan.status === 'error') {
        newMessage = `Sorry, I encountered an error: ${travelPlan.error}. Please try again with a different request.`;
      }

      if (newMessage) {
        setChatHistory(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            content: newMessage,
            type: 'assistant',
            timestamp: new Date()
          }
        ]);
      }
    }
  }, [travelPlan]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      const newMessage: ChatMessageType = {
        id: Date.now().toString(),
        content: message,
        type: 'user',
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, newMessage]);
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col h-full max-h-[90vh] bg-white rounded-xl border border-gray-100 overflow-hidden shadow-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-light text-black">How can I help you today?</h2>
        <p className="text-gray-600 text-sm font-light">
          Ask about outfits or event wear
        </p>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3" ref={chatContainerRef}>
        <div className="space-y-4">
          {chatHistory.map((msg) => (
            <ChatMessage
              key={msg.id}
              content={msg.content}
              type={msg.type}
              timestamp={msg.timestamp}
            />
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about travel or event outfits..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white text-sm font-light"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-3 rounded-xl ${
              isLoading || !message.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            } transition-colors duration-200`}
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
