import React, { useState, useRef, useEffect } from 'react';
import { useChatStore, ChatActionType } from '@/store/chatStore';
import ChatMessage from './ChatMessage';
import { Send, X, Sparkles, Plus } from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';
import { useRouter } from 'next/navigation';

export default function ChatWindow() {
    const { messages, isLoading, addMessage, setLoading, toggleChat } = useChatStore();
    const { currentAnalysis } = useAnalysisStore();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Focus input on open
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleAction = (action: string, value: string) => {
        console.log('Action triggered:', action, value);

        switch (action) {
            case ChatActionType.NAVIGATE:
            case ChatActionType.ANALYZE_SKIN:
                router.push(value);
                // On mobile we might want to close chat?
                break;
            case ChatActionType.ADD_TO_CART:
                // Mock Add to Cart
                alert(`Added product ${value} to cart! (Mock)`);
                break;
            default:
                console.warn('Unknown action:', action);
        }
    };

    const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
        e?.preventDefault();
        const textToSend = textOverride || input.trim();

        if (!textToSend || isLoading) return;

        setInput('');

        // Add user message to store
        addMessage({ role: 'user', content: textToSend });
        setLoading(true);

        try {
            // Prepare context
            const analysisId = currentAnalysis?.analysisId;

            // Call API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: textToSend }].map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    analysisId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle rate limiting specifically
                if (response.status === 429) {
                    throw new Error("You're chatting too fast! Please wait a moment.");
                }
                throw new Error(data.error || 'Failed to get response');
            }

            // Add AI response
            addMessage({
                role: 'assistant',
                content: data.content, // Backend sends 'content' for text
                suggestedActions: data.suggestedActions,
                productCards: data.productCards
            });

        } catch (error) {
            console.error('Chat error:', error);
            addMessage({
                role: 'assistant',
                content: (error instanceof Error ? error.message : "I'm having a little trouble connecting right now. Please try again!"),
                suggestedActions: [
                    { label: "Try again", action: "retry", value: "retry" }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white shadow-md">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Mai</h3>
                        <p className="text-xs text-purple-600 font-medium">Your Skin Expert</p>
                    </div>
                </div>
                <button
                    onClick={toggleChat}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 1 && (
                    <div className="grid grid-cols-2 gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4">
                        {[
                            { label: "Check my skin", icon: "✨", action: "Analyze my skin" },
                            { label: "Help with acne", icon: "🔴", action: "What helps with acne?" },
                            { label: "Anti-aging tips", icon: "⏳", action: "Tips for anti-aging" },
                            { label: "Build a routine", icon: "🧴", action: "Help me build a routine" }
                        ].map((starter, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(undefined, starter.action)}
                                className="p-3 bg-white border border-gray-200 rounded-xl text-left hover:border-purple-300 hover:shadow-md transition-all group"
                            >
                                <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{starter.icon}</div>
                                <div className="text-xs font-medium text-gray-600 group-hover:text-purple-600">{starter.label}</div>
                            </button>
                        ))}
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <ChatMessage
                        key={idx}
                        message={msg}
                        onAction={handleAction}
                        onAddToCart={(id) => handleAction(ChatActionType.ADD_TO_CART, id)}
                    />
                ))}

                {isLoading && (
                    <div className="flex gap-3 mb-4 animate-in fade-in">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white opacity-50">
                            <Sparkles size={16} />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium mr-1">Mai is typing</span>
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={(e) => handleSend(e)} className="relative flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your skin..."
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-inner"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg shadow-md disabled:opacity-50 disabled:shadow-none hover:shadow-lg transition-all"
                    >
                        <Send size={18} />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-400">
                        Mai is an AI assistant. Please consult a dermatologist for medical advice.
                    </p>
                </div>
            </div>
        </div>
    );
}
