require('dotenv').config({ path: '../.env' });

const amqp = require('amqplib');

async function produce_to_q_A() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    // Create a channel
    const channel = await connection.createChannel();

    // Create the direct exchange
    const exchangeName = process.env.EXCHANGE_NAME;
    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    // Send messages to the chart_A
    const routingKey_q_A = process.env.ROUTING_KEY_Q_A;

    // Send a random number every 20 seconds
    setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 100);
      channel.publish(exchangeName, routingKey_q_A, Buffer.from(`Random number: ${randomNumber}`));
      console.log(`Sent random number: ${randomNumber} to queue with routing key eq to ${routingKey_q_A}`);
    }, 20000);

  } catch (error) {
    console.log(error);
  }
}

produce_to_q_A();