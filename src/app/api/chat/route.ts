import { NextResponse } from 'next/server';

// This will handle both guided (button) and free-form chat
export async function POST(request: Request) {
  const { message, conversationId, nodeId, userSelections } = await request.json();

  // If nodeId is provided, it's a guided flow (button click)
  if (nodeId) {
    const nextNode = chatDecisionTree[nodeId];
    return NextResponse.json({
      message: nextNode.message,
      buttons: nextNode.buttons,
      products: nextNode.products || []
    });
  }

  // Otherwise, it's a free-form question - call OpenAI
  // const aiResponse = await callOpenAI(message, conversationId);
  
  return NextResponse.json({
    message: "AI response here",
    buttons: [],
    products: []
  });
}