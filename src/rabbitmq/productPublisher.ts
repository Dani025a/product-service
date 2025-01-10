import { rabbitMQ } from "./connection";


export const publishStockUpdated = async (message: any): Promise<void> => {
  const channel = rabbitMQ.getChannel();
  const routingKey = "stock.update"
  await channel.assertExchange('product', 'direct', { durable: false });
  channel.publish('product', routingKey, Buffer.from(message));
  console.log(`Message published to exchange stock_update with routingKey ${routingKey}: ${message}`);
};


