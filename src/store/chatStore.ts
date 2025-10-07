import { create } from 'zustand';

interface ChatState {
  conversationId: string;
  messages: Message[];
  currentNode: string;
  userSelections: Record<string, string>;
  cartItems: string[];
  
  addMessage: (message: Message) => void;
  setCurrentNode: (nodeId: string) => void;
  addUserSelection: (key: string, value: string) => void;
  addToCart: (productId: string) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversationId: '',
  messages: [],
  currentNode: 'initial',
  userSelections: {},
  cartItems: [],
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setCurrentNode: (nodeId) => set({ currentNode: nodeId }),
  
  addUserSelection: (key, value) => set((state) => ({
    userSelections: { ...state.userSelections, [key]: value }
  })),
  
  addToCart: (productId) => set((state) => ({
    cartItems: [...state.cartItems, productId]
  })),
  
  resetChat: () => set({
    messages: [],
    currentNode: 'initial',
    userSelections: {},
    conversationId: Date.now().toString()
  })
}));