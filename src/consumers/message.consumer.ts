import { getChannel } from "../config/rabbitmq.config";
import { publishMessage } from "../publishers/message.publisher";
import { processMessage } from "../services/chat.service";

const QUEUE_IN = 'message.sent';

export const startConsumer = async (): Promise<void> => {
  const channel = getChannel();

  await channel.assertQueue(QUEUE_IN, { durable: true });

  console.log(`Waiting for messages in queue: ${QUEUE_IN}`);

  channel.consume(QUEUE_IN, async (msg) => {
    if (!msg) return;

    try {
      const { sessionId, userMessage } = JSON.parse(msg.content.toString());

      console.log(`Message received - sessionId: ${sessionId}`);

      const response = await processMessage(sessionId, userMessage);

      await publishMessage(sessionId, response);

      channel.ack(msg);

    } catch (error) {
      console.error('Error processing message: ', error);
      channel.nack(msg, false, false);
    }
  });
}