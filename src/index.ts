import express from 'express';
import 'dotenv/config';

import { connectMongo } from './config/mongo.config';
import { connectRabbitMQ } from './config/rabbitmq.config';
import { startConsumer } from './consumers/message.consumer';
import router from './routes/health.route';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

const bootsrap = async () => {
  try {

    await connectMongo();
    await connectRabbitMQ();
    await startConsumer();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });

  } catch (error) {

    console.error('Error connecting to MongoDB', error);
    process.exit(1);

  }
}

bootsrap();
