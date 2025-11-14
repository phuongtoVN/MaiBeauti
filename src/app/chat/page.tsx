'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ShoppingCart, User } from 'lucide-react';
import Header from '@/components/Header';

// Types
interface Message {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
  buttons?: ChatButton[];
  products?: ProductInChat[];
}

interface ChatButton {
  text: string;
  icon?: string;
  action: 'navigate' | 'recommend' | 'answer';
  nextNode?: string;
}

interface ProductInChat {
  id: string;
  name: string;
  image: string;
  price: number;
  targetsConcern: string;
  rating: number;
}

// Suggested starter questions
const STARTER_QUESTIONS = [
  {
    icon: '🔴',
    text: 'Help me fix acne',
    category: 'concern',
    nextNode: 'acne_speed'
  },
  {
    icon: '🟠',
    text: 'Build complete routine',
    category: 'routine',
    nextNode: 'routine_type'
  },
  {
    icon: '🟡',
    text: 'Reduce dark circles',
    category: 'concern',
    nextNode: 'dark_circles'
  },
  {
    icon: '🟢',
    text: 'Minimize pores',
    category: 'concern',
    nextNode: 'pores_type'
  },
  {
    icon: '🔵',
    text: 'Anti-aging solutions',
    category: 'concern',
    nextNode: 'aging_priority'
  },
  {
    icon: '🟣',
    text: 'Product recommendations',
    category: 'products',
    nextNode: 'product_questions'
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      sender: 'ai',
      content: "Hi! I'm Mai, your AI skincare consultant. I'm here to help you find the perfect products for your skin. What would you like help with today?",
      timestamp: new Date(),
      buttons: []
    };
    setMessages([welcomeMessage]);
  }, []);

  // Handle starter question click
  const handleStarterClick = async (starter: typeof STARTER_QUESTIONS[0]) => {
    setShowStarters(false);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: starter.text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = getAIResponse(starter.nextNode);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle button click in chat
  const handleButtonClick = async (button: ChatButton) => {
    // Add user's selection as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: button.text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Get next AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = getAIResponse(button.nextNode || 'default');
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle custom text input
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowStarters(false);

    // Call API with user's custom question
    // const response = await fetch('/api/chat/message', {
    //   method: 'POST',
    //   body: JSON.stringify({ message: inputValue, conversationId })
    // });

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: "I understand you're asking about that. Let me help you find the right solution...",
        timestamp: new Date(),
        buttons: [
          { text: 'Tell me more', action: 'answer' },
          { text: 'Show me products', action: 'recommend' },
          { text: 'Start over', action: 'navigate', nextNode: 'initial' }
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Mock AI response generator (replace with actual API)
  const getAIResponse = (nodeId: string): Message => {
    const responses: Record<string, Message> = {
      acne_speed: {
        id: Date.now().toString(),
        sender: 'ai',
        content: "I can help you with acne! How quickly would you like to see results?",
        timestamp: new Date(),
        buttons: [
          { text: 'As fast as possible', action: 'navigate', nextNode: 'acne_sensitivity' },
          { text: 'Gradual improvement', action: 'navigate', nextNode: 'acne_sensitivity' },
          { text: 'Recommend what works', action: 'navigate', nextNode: 'acne_sensitivity' }
        ]
      },
      acne_sensitivity: {
        id: Date.now().toString(),
        sender: 'ai',
        content: "Great! Do you have sensitive skin?",
        timestamp: new Date(),
        buttons: [
          { text: 'Yes, very sensitive', action: 'recommend', nextNode: 'recommend_gentle' },
          { text: 'No, I can handle strong products', action: 'recommend', nextNode: 'recommend_intensive' },
          { text: 'Not sure', action: 'recommend', nextNode: 'recommend_balanced' }
        ]
      },
      routine_type: {
        id: Date.now().toString(),
        sender: 'ai',
        content: "Perfect! Let's build your complete routine. Are you new to skincare or already have experience?",
        timestamp: new Date(),
        buttons: [
          { text: 'Complete beginner', action: 'navigate', nextNode: 'beginner_routine' },
          { text: 'I have some experience', action: 'navigate', nextNode: 'intermediate_routine' },
          { text: 'Advanced user', action: 'navigate', nextNode: 'advanced_routine' }
        ]
      },
      default: {
        id: Date.now().toString(),
        sender: 'ai',
        content: "I'm here to help! What else would you like to know?",
        timestamp: new Date(),
        buttons: [
          { text: 'Show products', action: 'recommend' },
          { text: 'Ask another question', action: 'answer' },
          { text: 'Start over', action: 'navigate', nextNode: 'initial' }
        ]
      }
    };

    return responses[nodeId] || responses.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Chat Header */}
        <div className="bg-white rounded-t-2xl border-b border-rose-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat with Mai</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online - AI Skincare Consultant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {/* Message Bubble */}
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>

              {/* Button Options */}
              {message.buttons && message.buttons.length > 0 && (
                <div className="mt-3 ml-0 space-y-2">
                  {message.buttons.map((button, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleButtonClick(button)}
                      className="block w-full text-left px-4 py-3 bg-white border-2 border-rose-200 rounded-xl hover:bg-rose-50 hover:border-rose-400 transition text-gray-700 font-medium"
                    >
                      {button.icon} {button.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Starter Questions */}
          {showStarters && messages.length === 1 && (
            <div className="space-y-4 mt-6">
              <p className="text-sm text-gray-600 font-medium">Popular topics:</p>
              <div className="grid grid-cols-2 gap-3">
                {STARTER_QUESTIONS.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStarterClick(starter)}
                    className="flex items-center space-x-2 px-4 py-3 bg-white border-2 border-rose-200 rounded-xl hover:bg-rose-50 hover:border-rose-400 transition text-left"
                  >
                    <span className="text-2xl">{starter.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{starter.text}</span>
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-600 font-medium mt-6">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(question);
                      setShowStarters(false);
                    }}
                    className="px-3 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-medium hover:bg-rose-100 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl border-t border-rose-100 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Mai is an AI assistant. For medical concerns, please consult a dermatologist.
          </p>
        </div>
      </div>
    </div>
  );
}