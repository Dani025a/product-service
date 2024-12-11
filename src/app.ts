import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoute';
import productViewRoutes from './routes/productViewRoute';
import cors from 'cors'
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json());


app.use('/api', productRoutes);
app.use('/api', productViewRoutes);

export default app;
