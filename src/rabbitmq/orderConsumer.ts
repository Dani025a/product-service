import { getChannel } from './connection';
import  ProductService  from '../services/productService';


export const consumeProductValidation = async () => {
  const channel = getChannel();
  const queue = 'product.validation'; 

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, 'order.exchange', 'product.validation');

  console.log(`Listening to queue: ${queue}`);

  channel.consume(queue, async (message: any) => {
    if (message) {
      try {
        const data = JSON.parse(message.content.toString());
        const replyTo = message.properties.replyTo;
        const correlationId = message.properties.correlationId;

        console.log('Received Product Validation Request:', {
          ...data,
          replyTo,
          correlationId,
        });

        const validationResponse = await ProductService.validateProductStockAndPrice({
          ...data,
          replyTo,
          correlationId,
        });

        if (replyTo && correlationId) {
          console.log(`Sending response to: ${replyTo}`);
          channel.sendToQueue(
            replyTo,
            Buffer.from(JSON.stringify(validationResponse)),
            { correlationId }
          );
        }

        channel.ack(message);
      } catch (error) {
        console.error('Error processing Product Validation:', error);
        channel.nack(message, false, false);
      }
    }
  });
};


export const consumeCancelReservation = async () => {
  const channel = getChannel();
  const queue = 'order.cancel_reservation.queue';

  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (message: any) => {
    if (message) {
      try {
        const data = JSON.parse(message.content.toString());
        console.log('Received Cancel Reservation:', data);

        await ProductService.handleCancelReservation(data);

        channel.ack(message);
      } catch (error) {
        console.error('Error processing Cancel Reservation:', error);
        channel.nack(message, false, false);
      }
    }
  });

  console.log('Listening for Cancel Reservation...');
};
