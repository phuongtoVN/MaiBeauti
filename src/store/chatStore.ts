import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum ChatActionType {
  NAVIGATE = 'navigate',
  ADD_TO_CART = 'add_to_cart',
  ANALYZE_SKIN = 'analyze_skin',
  VIEW_PRODUCT = 'view_product',
}

export interface ProductCard {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  whyRecommended: string;
  inStock?: boolean;
}

export interface SuggestedAction {
  label: string;
  action: ChatActionType | string;
  value: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  suggestedActions?: SuggestedAction[];
  productCards?: ProductCard[];
  timestamp: number;
}

interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  hasUnread: boolean;

  // Actions
  toggleChat: () => void;
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
  setLoading: (isLoading: boolean) => void;
  clearHistory: () => void;
  markRead: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      messages: [
        {
          role: 'assistant',
          content: "Hi chat! I'm Mai, your personal skin expert. How can I help you with your skincare journey today?",
          timestamp: Date.now(),
          suggestedActions: [
            { label: "Analyze my skin (FREE)", action: ChatActionType.ANALYZE_SKIN, value: "/analyze-skin" },
            { label: "Help with acne", action: ChatActionType.NAVIGATE, value: "/products?concern=acne" }
          ]
        },
      ],
      isLoading: false,
      hasUnread: true,

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen, hasUnread: false })),
      setIsOpen: (isOpen) => set({ isOpen, hasUnread: false }),

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...message, timestamp: Date.now() },
          ],
        })),

      setLoading: (isLoading) => set({ isLoading }),

      clearHistory: () =>
        set({
          messages: [
            {
              role: 'assistant',
              content: "Hi chat! I'm Mai, your personal skin expert. How can I help you with your skincare journey today?",
              timestamp: Date.now(),
              suggestedActions: [
                { label: "Analyze my skin", action: ChatActionType.ANALYZE_SKIN, value: "/analyze-skin" }
              ]
            },
          ],
        }),

      markRead: () => set({ hasUnread: false }),
    }),
    {
      name: 'maibeauti-chat-storage',
      partialize: (state) => ({ messages: state.messages }), // Only persist messages
    }
  )
);