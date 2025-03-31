import { ClientProvider, Transport } from '@nestjs/microservices';

export default (): ClientProvider => ({
  transport: Transport.RMQ,
  options: {
    urls: [
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`,
    ],
    queue: 'notifications_queue',
    queueOptions: {
      durable: false,
      persistent: false,
    },
  },
});
