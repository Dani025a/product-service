import FilterService from '../services/filterService';
import { rabbitMQ } from './connection';

const EXCHANGE_NAME = 'filter_service_exchange';

export const AddFilter = async (): Promise<void> => {
  const queue = 'filter';
  const routingKey = 'filter.create';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log(`Message received with routingKey ${routingKey}:`, data);
        await FilterService.createFilter(data);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false);
      }
    }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const UpdateFilter = async (): Promise<void> => {
  const queue = 'filter';
  const routingKey = 'filter.update';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log(`Message received with routingKey ${routingKey}:`, data);
        await FilterService.updateFilter(data);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false);
      }
    }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const DeleteFilter = async (): Promise<void> => {
  const queue = 'filter';
  const routingKey = 'filter.delete';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log(`Message received with routingKey ${routingKey}:`, data);
        await FilterService.deleteFilter(data);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false);
      }
    }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const AddFilterValue = async (): Promise<void> => {
  const queue = 'filterValue';
  const routingKey = 'filterValue.create';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log(`Message received with routingKey ${routingKey}:`, data);
        await FilterService.createFilterValue(data);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false);
      }
    }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const UpdatefilterValue = async (): Promise<void> => {
  const queue = 'filterValue';
  const routingKey = 'filterValue.update';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log(`Message received with routingKey ${routingKey}:`, data);
        await FilterService.updateFilterValue(data);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false);
      }
    }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const DeletefilterValue = async (): Promise<void> => {
  const queue = 'filterValue';
  const routingKey = 'filterValue.delete';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log(`Message received with routingKey ${routingKey}:`, data);
        await FilterService.deleteFilterValue(data);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false);
      }
    }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};

export const addProductFilter = async (): Promise<void> => {
  const queue = 'productFilter';
  const routingKey = 'productFilter.create';
  const channel = rabbitMQ.getChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, async (msg: any) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log(`Message received with routingKey ${routingKey}:`, data);
        await FilterService.createProductFilter(data);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false);
      }
    }
  });
  console.log(`Waiting for messages in queue ${q.queue} with routingKey ${routingKey}`);
};
