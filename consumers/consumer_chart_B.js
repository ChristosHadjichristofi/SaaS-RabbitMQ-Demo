require('dotenv').config();

require('dotenv').config({ path: '../.env' });

async function consume_from_q_B() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    // Create a channel
    const channel = await connection.createChannel();

    // Create the direct exchange
    const exchangeName = process.env.EXCHANGE_NAME;
    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    // Create the chart_B queue and bind it to the exchange
    const queueName = process.env.QUEUE_B;
    await channel.assertQueue(queueName, { durable: true });
    channel.bindQueue(queueName, exchangeName, process.env.ROUTING_KEY_Q_B);

    // Consume messages from the chart_B queue
    console.log('Waiting for messages from chart B...');
    channel.consume(queueName, (message) => {
      console.log(`Received message from chart B: ${message.content.toString()}`);
      channel.ack(message);
    });
  } catch (error) {
    console.log(error);
  }
}

consume_from_q_B();