import { Conversation } from "../models/conversation.model"
import { getClaudeResponse } from "./claude.service";

export const processMessage = async (sessionId: string, userMessage: string): Promise<string> => {
  let conversation = await Conversation.findOne({ sessionId });

  if (!conversation) {
    conversation = new Conversation({ sessionId, messages: [] });
  }

  conversation.messages.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  });

  const assistanResponse = await getClaudeResponse(conversation.messages);

  conversation.messages.push({
    role: 'assistant',
    content: assistanResponse,
    timestamp: new Date()
  });
  
  await conversation.save();

  return assistanResponse;
}
