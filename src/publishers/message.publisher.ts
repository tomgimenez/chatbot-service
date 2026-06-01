import { getChannel } from "../config/rabbitmq.config";

const QUEUE_OUT = 'message.response';

export const publishMessage = async (sessionId: string, response: string): Promise<void> => {
  const channel = getChannel();

  await channel.assertQueue(QUEUE_OUT, { durable: true });

  channel.sendToQueue(
    QUEUE_OUT,
    Buffer.from(JSON.stringify({sessionId, response})),
    { persistent: true }
  );

  console.log(`Response published - sessionId: ${sessionId}`)
}
