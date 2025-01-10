import ProductService from '../services/productService';
import { rabbitMQ } from './connection';

export const consumeProductAdds = async (): Promise<void> => {
  const EXCHANGE_NAME = 'product'
  const queue = 'product';
  const routingKey = 'product.create';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
        try {
          const productAdd = JSON.parse(msg.content.toString());
          console.log('Received product add event:', productAdd);
    
          await ProductService.createProduct(productAdd);
  
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing Cancel Reservation:', error);
          channel.nack(msg, false, false);
        }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};


export const consumeProductUpdates = async (): Promise<void> => {
  const EXCHANGE_NAME = 'product'
  const queue = 'product';
  const routingKey = 'product.update';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
        try {
          const productUpdate = JSON.parse(msg.content.toString());
          console.log('Received product update:', productUpdate);
    
          await ProductService.updateProduct(productUpdate);
  
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing Cancel Reservation:', error);
          channel.nack(msg, false, false);
        }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};


export const consumeProductDeletes = async (): Promise<void> => {
  const EXCHANGE_NAME = 'product'
  const queue = 'product';
  const routingKey = 'product.delete';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
        try {
          const productDelete = JSON.parse(msg.content.toString());
          console.log('Received product delete event:', productDelete);
  
          const { productId } = productDelete;
  
          await ProductService.deleteProduct(productId);
  
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing Cancel Reservation:', error);
          channel.nack(msg, false, false);
        }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

