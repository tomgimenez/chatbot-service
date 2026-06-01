import Anthropic from "@anthropic-ai/sdk";
import { IMessage } from "../models/conversation.model";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const getClaudeResponse = async (messages: IMessage[]): Promise<string> => {
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'Eres un asistente de una tienda e-commerce. Ayudás a los usuarios con consultas sobre productos, pedidos y envíos. Respondé siempre en el idioma del usuario.',
    messages: formattedMessages
  });

  const block = response.content[0];

  if (block.type !== 'text')
    throw new Error('Unexpected response type from Claude');

  return block.text;
}
