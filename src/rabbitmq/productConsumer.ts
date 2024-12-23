import { getChannel } from './connection';
import ProductService from '../services/productService';

export const consumeProductUpdates = async () => {
  const channel = getChannel();
  const queue = 'product_updated';

  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (message) => {
    if (message) {
      try {
        const productUpdate = JSON.parse(message.content.toString());
        console.log('Received product update:', productUpdate);

        await ProductService.updateProduct(productUpdate);

        channel.ack(message);
      } catch (error) {
        console.error('Error processing product update:', error);
        channel.nack(message, false, false);
      }
    }
  });

  console.log('Listening for product updates...');
};

export const consumeProductAdds = async () => {
    try {
      const channel = getChannel();
      const queue = 'product_added';
  
      await channel.assertQueue(queue, { durable: true });
      channel.consume(queue, async (message) => {
        if (message) {
          try {
            const productAdd = JSON.parse(message.content.toString());
            console.log('Received product add event:', productAdd);
  
            await ProductService.createProduct(productAdd);
  
            channel.ack(message);
          } catch (error) {
            console.error('Error processing product add event:', error);
            channel.nack(message, false, false);
          }
        }
      });
  
      console.log('Listening for product add events...');
    } catch (error) {
      console.error('Error initializing product add consumer:', error);
    }
  };

  export const consumeProductDeletes = async () => {
    try {
      const channel = getChannel();
      const queue = 'product_deleted';
  
      await channel.assertQueue(queue, { durable: true });
      channel.consume(queue, async (message) => {
        if (message) {
          try {
            const productDelete = JSON.parse(message.content.toString());
            console.log('Received product delete event:', productDelete);
  
            const { productId } = productDelete;
  
            await ProductService.deleteProduct(productId);
  
            channel.ack(message);
          } catch (error) {
            console.error('Error processing product delete event:', error);
            channel.nack(message, false, false);
          }
        }
      });
  
      console.log('Listening for product delete events...');
    } catch (error) {
      console.error('Error initializing product delete consumer:', error);
    }
  };