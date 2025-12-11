'use client';

import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import ChatWindow from './ChatWindow';
import { Sparkles, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ChatWidget() {
    const { isOpen, toggleChat, hasUnread } = useChatStore();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't show on auth pages or chat page
    if (!mounted || pathname?.startsWith('/auth') || pathname === '/chat') return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div
                className={`
          mb-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
        `}
            >
                <ChatWindow />
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className={`
          group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105
          ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white'}
        `}
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}

                {/* Unread Badge */}
                {!isOpen && hasUnread && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
                )}

                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Chat with Mai ✨
                        <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white transform -translate-y-1/2 rotate-45" />
                    </div>
                )}
            </button>
        </div>
    );
}
