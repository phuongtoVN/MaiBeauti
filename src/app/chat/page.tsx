'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import { useChatStore, ChatActionType } from '@/store/chatStore';
import { useAnalysisStore } from '@/store/analysisStore';
import ChatMessage from '@/components/chat/ChatMessage';
import { useRouter } from 'next/navigation';

// Suggested starter questions
const STARTER_QUESTIONS = [
  {
    icon: '🔴',
    text: 'Help me fix acne',
    action: 'What helps with acne?'
  },
  {
    icon: '🟠',
    text: 'Build complete routine',
    action: 'Help me build a routine'
  },
  {
    icon: '🟡',
    text: 'Reduce dark circles',
    action: 'How to fix dark circles?'
  },
  {
    icon: '🟢',
    text: 'Minimize pores',
    action: 'How to minimize pores?'
  },
  {
    icon: '🔵',
    text: 'Anti-aging solutions',
    action: 'Anti-aging tips'
  },
  {
    icon: '🟣',
    text: 'Product recommendations',
    action: 'Recommend products for me'
  }
];

const QUICK_QUESTIONS = [
  'How long to see results?',
  'Safe for sensitive skin?',
  'Can I use during pregnancy?',
  'What\'s your return policy?',
  'Do products expire?',
  'How to layer products?'
];

export default function ChatPage() {
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const { currentAnalysis } = useAnalysisStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleAction = (action: string, value: string) => {
    switch (action) {
      case ChatActionType.NAVIGATE:
      case ChatActionType.ANALYZE_SKIN:
        router.push(value);
        break;
      case ChatActionType.ADD_TO_CART:
        // Mock Add to Cart
        alert(`Added product ${value} to cart! (Mock)`);
        break;
      default:
        // Treat as a message (e.g. from starter chips)
        handleSendMessage(value);
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue.trim();
    if (!textToSend || isLoading) return;

    setInputValue('');

    // Add user message to store
    addMessage({ role: 'user', content: textToSend });
    setLoading(true);

    try {
      const analysisId = currentAnalysis?.analysisId;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat({ role: 'user', content: textToSend, timestamp: Date.now() }).map(m => ({
            role: m.role,
            content: m.content
          })),
          analysisId
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: data.content,
        suggestedActions: data.suggestedActions,
        productCards: data.productCards
      });

    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'assistant',
        content: (error instanceof Error ? error.message : "I'm having a little trouble connecting right now. Please try again!"),
        suggestedActions: [
          { label: "Reload Page", action: "retry", value: "retry" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* Chat Header */}
        <div className="bg-white rounded-t-2xl border-b border-rose-100 p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat with Mai</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Online - AI Skincare Consultant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white h-[600px] overflow-y-auto p-6 flex flex-col shadow-sm">
          <div className="flex-1 space-y-6">
            {messages.map((message, idx) => (
              <ChatMessage
                key={idx}
                message={message}
                onAction={handleAction}
                onAddToCart={(id) => handleAction(ChatActionType.ADD_TO_CART, id)}
              />
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Starter Questions (Only show if 1 message - the greeting) */}
          {messages.length === 1 && !isLoading && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-sm text-gray-600 font-medium mb-3">Popular topics:</p>
              <div className="grid grid-cols-2 gap-3">
                {STARTER_QUESTIONS.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(starter.action)}
                    className="flex items-center space-x-3 px-4 py-3 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition text-left group shadow-sm hover:shadow-md"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{starter.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{starter.text}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600 font-medium mb-3">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(question)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-xs font-medium hover:bg-rose-100 transition border border-rose-100"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl border-t border-rose-100 p-4 shadow-sm">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 bg-gray-50 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Mai is an AI assistant. For medical concerns, please consult a dermatologist.
          </p>
        </div>
      </div>
    </div>
  );
}