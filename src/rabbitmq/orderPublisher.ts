import { Order } from '../types/types';
import RabbitMQ from './connection';

class Publisher {
  static async publish(exchange: string, routingKey: string, message: object) {
    try {
      const channel = await RabbitMQ.connect();
      channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log(`Message published to ${exchange} with routing key ${routingKey}:`, message);
    } catch (error) {
      console.error(`Failed to publish message to ${exchange} with routing key ${routingKey}:`, error);
      throw error;
    }
  }

  static async publishReply(
    replyTo: string,
    correlationId: string,
    message: object
  ) {
    try {
      const channel = await RabbitMQ.connect();
      channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(message)), {
        correlationId,
      });
      console.log(
        `Published reply to ${replyTo} with correlationId ${correlationId}:`,
        message
      );
    } catch (error) {
      console.error('Failed to publish reply:', error);
      throw error;
    }
  }

  static async productStockUpdated(
    replyTo: string,
    correlationId: string,
    orderId: string
  ) {
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
