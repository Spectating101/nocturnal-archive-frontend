"use client"

import { useState, useEffect } from "react"
import { IconSend, IconMenu, IconX, IconChevronUp } from "@tabler/icons-react"
import StreamingMessage from "./StreamingMessage"

interface MobileOptimizedChatProps {
  messages: any[];
  onSend: (message: string) => void;
  loading: boolean;
  suggestions?: string[];
}

export default function MobileOptimizedChat({ 
  messages, 
  onSend, 
  loading, 
  suggestions = [] 
}: MobileOptimizedChatProps) {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(44);

  // Detect keyboard open/close on mobile
  useEffect(() => {
    const handleResize = () => {
      const initialHeight = window.innerHeight;
      const currentHeight = window.innerHeight;
      const heightDiff = initialHeight - currentHeight;
      
      // If height decreased significantly, keyboard is likely open
      setIsKeyboardOpen(heightDiff > 150);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const chatContainer = document.getElementById('mobile-chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    if (message.trim() && !loading) {
      onSend(message.trim());
      setMessage("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">Research Assistant</h1>
          <button className="p-2 text-gray-400 hover:text-white">
            <IconMenu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        id="mobile-chat-container"
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ 
          paddingBottom: isKeyboardOpen ? '20px' : '80px',
          transition: 'padding-bottom 0.3s ease'
        }}
      >
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconSend className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Start Researching</h3>
            <p className="text-gray-400 text-sm">
              Ask me anything about academic research
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              {message.type === 'user' ? (
                <div className="bg-blue-600 text-white rounded-2xl rounded-br-md p-3">
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                </div>
              ) : (
                <StreamingMessage
                  content={message.content}
                  isStreaming={message.isStreaming || false}
                  citations={message.citations}
                />
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-bl-md p-3 max-w-[85%]">
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Researching...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="flex-shrink-0 p-4 bg-gray-800 border-t border-gray-700">
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Suggested queries:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Input */}
      <div 
        className="flex-shrink-0 p-4 bg-gray-800 border-t border-gray-700"
        style={{
          position: isKeyboardOpen ? 'fixed' : 'relative',
          bottom: isKeyboardOpen ? '0' : 'auto',
          left: isKeyboardOpen ? '0' : 'auto',
          right: isKeyboardOpen ? '0' : 'auto',
          zIndex: isKeyboardOpen ? 50 : 'auto'
        }}
      >
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setInputHeight(Math.min(e.target.scrollHeight, 120));
              }}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Ask a research question..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ height: `${inputHeight}px` }}
              rows={1}
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
            className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <IconSend className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {!showSuggestions && (
          <button
            onClick={() => setShowSuggestions(true)}
            className="mt-2 w-full flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <IconChevronUp className="w-4 h-4" />
            <span className="text-sm">Show suggestions</span>
          </button>
        )}
      </div>
    </div>
  );
}
