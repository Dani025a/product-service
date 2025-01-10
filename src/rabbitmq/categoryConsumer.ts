import { rabbitMQ } from "./connection";
import { categoryService } from "../services/categoryService";
const EXCHANGE_NAME = 'category';

export const addMainCategory = async (): Promise<void> => {
  const queue = 'mainCategory.create';
  const routingKey = 'mainCategory.create';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
              console.log(`Message received with routingKey ${routingKey}:`, data);

              const type = 'mainCategory';
              await categoryService.createCategory({ ...data, type });

              channel.ack(msg);
          } catch (error) {
              console.error('Error processing message:', error);

              channel.nack(msg, false, false);
          }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};


export const deleteMainCategory = async (): Promise<void> => {
  const queue = 'mainCategory.delete';
  const routingKey = 'mainCategory.delete';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
              console.log(`Message received with routingKey ${routingKey}:`, data);

              const type = 'mainCategory';
              await categoryService.deleteCategory( data.id, type );

              channel.ack(msg);
          } catch (error) {
              console.error('Error processing message:', error);

              channel.nack(msg, false, false);
          }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};


export const updateMainCategory = async (): Promise<void> => {
  const queue = 'mainCategory.update';
  const routingKey = 'mainCategory.update';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
              console.log(`Message received with routingKey ${routingKey}:`, data);

              const type = 'mainCategory';
              await categoryService.updateCategory({ ...data, type });

              channel.ack(msg);
          } catch (error) {
              console.error('Error processing message:', error);

              channel.nack(msg, false, false);
          }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const addSubCategory = async (): Promise<void> => {
  const queue = 'subCategory.create';
  const routingKey = 'subCategory.create';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
              console.log(`Message received with routingKey ${routingKey}:`, data);

              const type = 'subCategory';
              await categoryService.createCategory({ ...data, type });

              channel.ack(msg);
          } catch (error) {
              console.error('Error processing message:', error);

              channel.nack(msg, false, false);
          }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const deleteSubCategory = async (): Promise<void> => {
  const queue = 'subCategory.delete';
  const routingKey = 'subCategory.delete';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
            const relatedData = data.relatedData;
              console.log(`Message received with routingKey ${routingKey}:`, data);

              const type = 'subCategory';
              await categoryService.deleteCategory({ ...data, type });

              channel.ack(msg);
          } catch (error) {
              console.error('Error processing message:', error);

              channel.nack(msg, false, false);
          }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const updateSubCategory = async (): Promise<void> => {
  const queue = 'subCategory.update';
  const routingKey = 'subCategory.update';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
              console.log(`Message received with routingKey ${routingKey}:`, data);

              const type = 'subCategory';
              await categoryService.updateCategory({ ...data, type });

              channel.ack(msg);
          } catch (error) {
              console.error('Error processing message:', error);

              channel.nack(msg, false, false);
          }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const addSubSubCategory = async (): Promise<void> => {
  const queue = 'subSubCategory.create';
  const routingKey = 'subSubCategory.create';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
              console.log(`Message received with routingKey ${routingKey}:`, data);

              const type = 'subSubCategory';
              await categoryService.createCategory({ ...data, type });

              channel.ack(msg);
          } catch (error) {
              console.error('Error processing message:', error);

              channel.nack(msg, false, false);
          }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const deleteSubSubCategory = async (): Promise<void> => {
  const queue = 'subSubCategory.delete';
  const routingKey = 'subSubCategory.delete';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
          try {
            const parsedMessage = JSON.parse(msg.content.toString());
            const {data, relatedData } = parsedMessage;
              console.log(`Message received with routingKey ${routingKey}:`, data);

              const type = 'subSubCategory'
              await categoryService.deleteCategory({ ...data, type }),

              channel.ack(msg);
          } catch (error) {
              console.error('Error processing message:', error);

              channel.nack(msg, false, false);
          }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const updateSubSubCategory = async (): Promise<void> => {
  const queue = 'subSubCategory.update';
  const routingKey = 'subSubCategory.update';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
      if (msg) {
          try {
            const parsedMessage = JSON.parse(msg.content.toString());
            const {data } = parsedMessage;
              console.log(`Message received with routingKey ${routingKey}:`, data);

              const type = 'subSubCategory'
              await categoryService.updateCategory({ ...data, type }),

              channel.ack(msg);
          } catch (error) {
              console.error('Error processing message:', error);

              channel.nack(msg, false, false);
          }
      }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};