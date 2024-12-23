import { getChannel } from './connection';

export const publishStockUpdated = async (message: any) => {
    const channel = getChannel();
    const queue = 'stock_updated';
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log('Published stock update:', message);
  };