import FilterServiceConsumer from '../services/filterService';
import { getChannel } from '../rabbitmq/connection';

const EXCHANGE_NAME = 'filter_service_exchange';

export async function filterConsumer() {
  const channel = await getChannel();

  await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

  const { queue } = await channel.assertQueue('', { exclusive: true });
  console.log(`Consumer queue created: ${queue}`);

  channel.bindQueue(queue, EXCHANGE_NAME, '#');

  channel.consume(queue, async (message) => {
    if (!message) return;


    try {
      const content = JSON.parse(message.content.toString());
      const { eventType, data } = content;


      console.log(`Received event: ${eventType}`);

      switch (eventType) {
        case 'filter.create':
          await FilterServiceConsumer.createFilter(data);
          break;
        case 'filter.update':
          await FilterServiceConsumer.updateFilter(data);
          break;
        case 'filter.delete':
          await FilterServiceConsumer.deleteFilter(data);
          break;
        case 'filterValue.create':
          await FilterServiceConsumer.createFilterValue(data);
          break;
        case 'filterValue.update':
          await FilterServiceConsumer.updateFilterValue(data);
          break;
        case 'filterValue.delete':
          await FilterServiceConsumer.deleteFilterValue(data);
          break;
        case 'productFilter.create':
          await FilterServiceConsumer.createProductFilter(data);
          break;
        default:
          console.warn(`Unhandled event type: ${eventType}`);
      }
      
      channel.ack(message);
    } catch (error) {
      console.error('Error processing message:', error);

      channel.nack(message, false, false);
    }
  });
}
