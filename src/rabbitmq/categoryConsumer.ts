import { getChannel } from './connection';
import { categoryService } from '../services/categoryService';


const processMessage = async (message: any) => {
  if (!message) return;

  const parsedMessage = JSON.parse(message.content.toString());
  const { action, type, data, additionalData } = parsedMessage;

  try {
    const actionHandlers: Record<string, Function> = {
      create: async () => categoryService.createCategory({ ...data, type }),
      update: async () => categoryService.updateCategory({ ...data, type }),
      delete: async () => categoryService.deleteCategory({ ...data, type }, additionalData),
    };

    const handler = actionHandlers[action];

    if (handler) {
      await handler();
    } else {
      console.error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
};


export const categoryConsumer = async () => {
  const channel = getChannel();

  if (!channel) {
    console.error('RabbitMQ channel is not available');
    return;
  }

  const queue = 'category';

  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (message) => {
    if (message) {
      await processMessage(message);
      channel.ack(message);
    }
  });
  console.log(`Listening to queue: ${queue}`);
};
