import { Order } from '../types/types';
import { rabbitMQ } from './connection';

class Publisher {
  static async publish(exchange: string, routingKey: string, message: object) {
    try {
      const channel = rabbitMQ.getChannel();
      await channel.assertExchange(exchange, 'direct', { durable: false });
      channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
      console.log(`Message published to ${exchange} with routing key ${routingKey}:`, message);
    } catch (error) {
      console.error(`Failed to publish message to ${exchange} with routing key ${routingKey}:`, error);
      throw error;
    }
  }

  static async publishReply(replyTo: string, correlationId: string, message: any) {
    try {
      await rabbitMQ.initialize();
      const channel = rabbitMQ.getChannel();
  
      if (replyTo.startsWith('amq.')) {
        throw new Error(`Invalid replyTo queue name: ${replyTo}`);
      }
  
      const messageBuffer = Buffer.from(JSON.stringify(message));
  
      const sent = channel.sendToQueue(replyTo, messageBuffer, { correlationId });
  
      if (sent) {
        console.log(`Reply sent to ${replyTo} with correlationId ${correlationId}`);
      } else {
        console.error(`Failed to send reply to ${replyTo}`);
      }
    } catch (error) {
      console.error('Error publishing reply:', error);
    }
  }
  

  static async productStockUpdated(
    replyTo: string,
    correlationId: string,
    orderId: string
  ) {
    if (!replyTo || !correlationId) {
      console.error('Missing replyTo or correlationId:', { replyTo, correlationId });
      throw new Error('Invalid replyTo or correlationId');
    }
  
    const message = {
      type: 'product.stock_updated',
      orderId,
    };
  
    await this.publishReply(replyTo, correlationId, message);
  }
  

  static async productReservationFailed(
    replyTo: string,
    correlationId: string,
    orderId: string,
    reason: string
  ) {
    const message = {
      type: 'product.reservation_failed',
      orderId,
      reason,
    };
    await this.publishReply(replyTo, correlationId, message);
  }

  static async reservationCancelled(order: Order) {
    try {
      await this.publish('product.exchange', 'product.reservation_cancelled', order);
      console.log(`Reservation cancellation event published for Order ID: ${order.id}`);
    } catch (error) {
      console.error(`Failed to publish reservation cancellation event for Order ID: ${order.id}`, error);
    }
  }
}

export default Publisher;
