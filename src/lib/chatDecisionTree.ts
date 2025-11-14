export interface ChatNode {
  id: string;
  message: string;
  buttons: ChatButton[];
  products?: string[]; // Product IDs to recommend
}

export const chatDecisionTree: Record<string, ChatNode> = {
  initial: {
    id: 'initial',
    message: "Hi! I'm Mai, your AI skincare consultant. How can I help you today?",
    buttons: [
      { text: '🔴 Help me fix acne', action: 'navigate', nextNode: 'acne_speed' },
      { text: '🟢 Build complete routine', action: 'navigate', nextNode: 'routine_type' },
      { text: '🟡 Reduce dark circles', action: 'navigate', nextNode: 'dark_circles' },
      { text: '🔵 Minimize pores', action: 'navigate', nextNode: 'pores_type' },
      { text: '🟠 Fight aging', action: 'navigate', nextNode: 'aging_priority' }
    ]
  },
  
  acne_speed: {
    id: 'acne_speed',
    message: "I can help with acne! How quickly would you like to see results?",
    buttons: [
      { text: 'As fast as possible', action: 'navigate', nextNode: 'acne_sensitivity' },
      { text: 'Gradual improvement', action: 'navigate', nextNode: 'acne_sensitivity' },
      { text: 'Recommend for me', action: 'navigate', nextNode: 'acne_sensitivity' }
    ]
  },
  
  acne_sensitivity: {
    id: 'acne_sensitivity',
    message: "Do you have sensitive skin?",
    buttons: [
      { text: 'Yes, very sensitive', action: 'recommend', nextNode: 'recommend_gentle_acne' },
      { text: 'No, I can handle strong products', action: 'recommend', nextNode: 'recommend_intensive_acne' },
      { text: 'Not sure', action: 'recommend', nextNode: 'recommend_balanced_acne' }
    ]
  },

  recommend_gentle_acne: {
    id: 'recommend_gentle_acne',
    message: "Perfect! Based on your sensitive skin, I recommend these gentle but effective acne products:",
    buttons: [
      { text: '💳 Add to cart ($89)', action: 'navigate', nextNode: 'added_to_cart' },
      { text: 'See alternatives', action: 'navigate', nextNode: 'acne_alternatives' },
      { text: 'Why these products?', action: 'answer', nextNode: 'acne_explanation' }
    ],
    products: ['gentle-cleanser-1', 'acne-serum-1', 'moisturizer-1']
  },

  routine_type: {
    id: 'routine_type',
    message: "Let's build your complete routine! Are you new to skincare?",
    buttons: [
      { text: 'Complete beginner', action: 'navigate', nextNode: 'beginner_routine' },
      { text: 'Some experience', action: 'navigate', nextNode: 'intermediate_routine' },
      { text: 'Advanced user', action: 'navigate', nextNode: 'advanced_routine' }
    ]
  },

  // Add more nodes for each conversation path...
};