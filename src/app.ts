import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoute';
import productViewRoutes from './routes/productViewRoute';
import cors from 'cors';
import { connectRabbitMQ } from './rabbitmq/connection';
import { consumeProductAdds, consumeProductDeletes, consumeProductUpdates } from './rabbitmq/productConsumer';
import { categoryConsumer } from './rabbitmq/categoryConsumer';
import { filterConsumer } from './rabbitmq/filterConsumer';
import categoryRouter from './routes/categoryRouter';
import filterRouter from './routes/filterRouter';
import { consumeProductValidation,  consumeCancelReservation} from './rabbitmq/orderConsumer';

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

(async () => {
  try {
    await connectRabbitMQ();
    await consumeProductAdds();
    await consumeProductDeletes();
    await consumeProductUpdates();
    await categoryConsumer();
    await filterConsumer();
    await consumeCancelReservation();
    await consumeProductValidation();
  } catch (error) {
    console.error('Failed to initialize service:', error);
  }
})();

app.use('/api', productRoutes);
app.use('/api', productViewRoutes);
app.use('/api/categories', categoryRouter);
app.use('/api/filters', filterRouter);

export default app;
