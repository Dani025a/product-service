import { rabbitMQ } from './connection';
import  ProductService  from '../services/productService';


export const consumeCancelReservation = async (): Promise<void> => {
  const EXCHANGE_NAME = 'order.exchange'
  const queue = 'order.cancel_reservation.queue';
  const routingKey = 'order.cancel_reservation.queue';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
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
  const EXCHANGE_NAME = 'order.exchange'
  const queue = 'product.validation';
  const routingKey = 'product.validation';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
  const q = await channel.assertQueue(queue, { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
        try {
          const data = JSON.parse(msg.content.toString());
          const replyTo = msg.properties.replyTo;
          const correlationId = msg.properties.correlationId;
  
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
  
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing Product Validation:', error);
          channel.nack(msg, false, false);
        }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

consumeProductValidation();
consumeCancelReservation();