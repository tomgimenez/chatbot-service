import amqp, { Channel, ChannelModel } from 'amqplib';

let connection: ChannelModel;
let channel: Channel;

export const connectRabbitMQ = async (): Promise<void> => {
  const url = process.env.RABBITMQ_URL;

  if (!url) {
    throw new Error('RABBITMQ_URL is not defined in environment variables');
  }

  try {
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    console.log('RabbitMQ connected');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    process.exit(1);
  }
};

export const getChannel = (): Channel => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ first');
  }
  return channel;
};