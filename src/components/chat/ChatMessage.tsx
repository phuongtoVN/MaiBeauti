import React from 'react';
import { Message, ChatActionType } from '@/store/chatStore';
import { User, Sparkles, ChevronRight } from 'lucide-react';
import ProductCardInChat from './ProductCardInChat';

interface ChatMessageProps {
    message: Message;
    onAction?: (action: string, value: string) => void;
    onAddToCart?: (productId: string) => void;
}

export default function ChatMessage({ message, onAction, onAddToCart }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex flex-col mb-6 animate-in fade-in slide-in-from-bottom-2 ${isUser ? 'items-end' : 'items-start'}`}>
            <div className={`flex gap-3 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${isUser ? 'bg-purple-100 text-purple-600' : 'bg-gradient-to-br from-rose-400 to-purple-500 text-white shadow-md'}
                `}>
                    {isUser ? <User size={16} /> : <Sparkles size={16} />}
                </div>

                {/* Message Bubble */}
                <div className={`
                    rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                    ${isUser
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white border border-gray-100 text-gray-900 rounded-tl-none'}
                `}>
                    <div className="whitespace-pre-wrap font-medium">
                        {message.content}
                    </div>
                    <div className={`text-[10px] mt-1 opacity-70 ${isUser ? 'text-purple-100' : 'text-gray-400'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>

            {/* Product Cards (Assistant Only) */}
            {!isUser && message.productCards && message.productCards.length > 0 && (
                <div className="w-full mt-3 pl-11 overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex gap-3 w-max px-1">
                        {message.productCards.map((product) => (
                            <ProductCardInChat
                                key={product.id}
                                product={product}
                                onAddToCart={(id) => onAddToCart?.(id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Actions (Assistant Only) */}
            {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pl-11">
                    {message.suggestedActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => onAction?.(action.action, action.value)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-purple-600 text-xs font-medium rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors shadow-sm"
                        >
                            {action.label}
                            {action.action === ChatActionType.NAVIGATE && <ChevronRight size={12} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
