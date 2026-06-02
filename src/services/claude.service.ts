import Anthropic from "@anthropic-ai/sdk";
import { IMessage } from "../models/conversation.model";
import { tools } from "../tools/product.tools";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const NESTJS_URL = process.env.NESTJS_URL || 'http://localhost:3000';

const executeTool = async (toolName: string, toolInput: Record<string, any>): Promise<string> => {
  if (toolName === 'search_products') {
    const params = new URLSearchParams();
    if (toolInput.q) params.append('q', toolInput.q);
    if (toolInput.category) params.append('category', toolInput.category);
    if (toolInput.minPrice) params.append('minPrice', toolInput.minPrice);
    if (toolInput.maxPrice) params.append('maxPrice', toolInput.maxPrice);
    params.append('limit', toolInput.limit || 5);

    const res = await fetch(`${NESTJS_URL}/products?${params.toString()}`);
    const data = await res.json();

    return JSON.stringify(data);
  }

  if (toolName === 'get_product') {
    const res = await fetch(`${NESTJS_URL}/products/${toolInput.slug}`);
    const data = await res.json();

    return JSON.stringify(data);
  }

  throw new Error(`Unknown tool: ${toolName}`);
}

export const getClaudeResponse = async (messages: IMessage[]): Promise<string> => {
  const formattedMessages: Anthropic.MessageParam[] = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  let response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'Eres un asistente de una tienda e-commerce. Ayudás a los usuarios con consultas sobre productos, pedidos y envíos. Respondé siempre en el idioma del usuario.',
    tools,
    messages: formattedMessages
  });

  // loop por si Claude llama multiples tools
  while (response.stop_reason === 'tool_use') {
    const toolUseBlock = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );

    if (!toolUseBlock) break;

    const toolResult = await executeTool(
      toolUseBlock.name,
      toolUseBlock.input as Record<string, any>
    );

    formattedMessages.push({
      role: 'assistant',
      content: response.content,
    });

    formattedMessages.push({
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: toolResult,
        },
      ],
    });

    response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: 'Eres un asistente de una tienda e-commerce. Ayudás a los usuarios con consultas sobre productos, precios y stock. Respondé siempre en el idioma del usuario. Cuando necesites información de productos, usá las tools disponibles.',
      tools,
      messages: formattedMessages,
    });
  }

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text'
  );

  if (!textBlock) {
    throw new Error('No text response from Claude');
  }

  return textBlock.text;
}
