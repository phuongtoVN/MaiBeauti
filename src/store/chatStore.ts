import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  products?: any[]; // Product recommendations in message
  options?: string[]; // Button options for decision tree
}

interface ChatStore {
  messages: ChatMessage[];
  isTyping: boolean;
  conversationPath: string[]; // Track decision tree path
  
  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setIsTyping: (isTyping: boolean) => void;
  addToPath: (nodeId: string) => void;
  resetPath: () => void;
  
  // Helper
  getLastMessage: () => ChatMessage | undefined;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,
  conversationPath: [],

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  clearMessages: () => {
    set({ messages: [], conversationPath: [] });
  },

  setIsTyping: (isTyping) => {
    set({ isTyping });
  },

  addToPath: (nodeId) => {
    set((state) => ({
      conversationPath: [...state.conversationPath, nodeId],
    }));
  },

  resetPath: () => {
    set({ conversationPath: [] });
  },

  getLastMessage: () => {
    const messages = get().messages;
    return messages[messages.length - 1];
  },
}));