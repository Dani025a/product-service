import amqp, { Channel, Connection } from 'amqplib';


const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  if (!channel) {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  }
  return channel;
};

export const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ first.');
  return channel;
};

class RabbitMQ {
  private static connection: Connection;
  private static channel: Channel;

  static async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      this.channel = await this.connection.createChannel();
      await channel.assertExchange('order.exchange', 'topic', { durable: true });
      await channel.assertExchange('product.exchange', 'topic', { durable: true });
      await channel.assertExchange('payment.exchange', 'topic', { durable: true });
    }
    return this.channel;
  }

  static async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}

export default RabbitMQ;
