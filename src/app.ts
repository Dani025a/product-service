import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoute';
import productViewRoutes from './routes/productViewRoute';
import cors from 'cors';
import categoryRouter from './routes/categoryRouter';
import filterRouter from './routes/filterRouter';
import { rabbitMQ } from './rabbitmq/connection';
import { AddFilter, UpdateFilter, DeleteFilter, AddFilterValue, UpdatefilterValue, DeletefilterValue, addProductFilter } from './rabbitmq/filterConsumer';
import { addMainCategory, addSubCategory, addSubSubCategory, deleteMainCategory, deleteSubCategory, deleteSubSubCategory, updateMainCategory, updateSubCategory, updateSubSubCategory } from './rabbitmq/categoryConsumer';

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
    await rabbitMQ.initialize();
    console.log('RabbitMQ is ready for operations.');
    await AddFilter();
    await UpdateFilter();
    await DeleteFilter();
    await AddFilterValue();
    await UpdatefilterValue();
    await DeletefilterValue();
    await addProductFilter();
    await addMainCategory();
    await updateMainCategory();
    await deleteMainCategory();
    await addSubCategory();
    await updateSubCategory();
    await deleteSubCategory();
    await addSubSubCategory();
    await updateSubSubCategory();
    await deleteSubSubCategory();
  } catch (error) {
    console.error('Failed to initialize RabbitMQ:', error);
    process.exit(1);
  }
})();

app.use('/api', productRoutes);
app.use('/api', productViewRoutes);
app.use('/api/categories', categoryRouter);
app.use('/api/filters', filterRouter);

export default app;
