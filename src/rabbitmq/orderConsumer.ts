import { rabbitMQ } from './connection';
import  ProductService  from '../services/productService';


export const consumeCancelReservation = async (): Promise<void> => {
  const EXCHANGE_NAME = 'order.exchange'
  const queue = 'order.cancel_reservation.queue';
  const routingKey = 'order.cancel_reservation.queue';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log('Received Cancel Reservation:', data);
  
          await ProductService.handleCancelReservation(data);
  
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing Cancel Reservation:', error);
          channel.nack(msg, false, false);
        }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};


export const consumeProductValidation = async (): Promise<void> => {
  const EXCHANGE_NAME = 'product.validation';
  const routingKey = 'product.validation';
  const channel = rabbitMQ.getChannel();

  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const { queue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue, EXCHANGE_NAME, routingKey);

  channel.consume(queue, async (msg: any) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log('Received Data:', data);

        const replyTo = msg.properties.replyTo;
        const correlationId = msg.properties.correlationId;

        if (!replyTo || !correlationId) {
          throw new Error('Missing replyTo or correlationId in message properties');
        }

        console.log('Processing validation for:', { replyTo, correlationId });

        console.log("data send to the validateProductStockAndPrice", data)

        const dataWithProperties = {
          ...data,
          replyTo,
          correlationId,
        };

        const validationResponse = await ProductService.validateProductStockAndPrice(dataWithProperties);

        console.log('Validation Response:', validationResponse);

        if (!validationResponse!) {
          throw new Error('Validation response is undefined');
        }

        channel.sendToQueue(
          replyTo,
          Buffer.from(JSON.stringify(validationResponse)),
          { correlationId }
        );

        channel.ack(msg);
      } catch (error) {
        console.error('Error processing Product Validation:', error);
        channel.nack(msg, false, false);
      }
    }
  });

  console.log(`Waiting for messages in queue ${queue} with routingKey ${routingKey}`);
};
