require('dotenv').config();

const amqp = require('amqplib');

async function produce_to_q_B() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    // Create a channel
    const channel = await connection.createChannel();

    // Create the direct exchange
    const exchangeName = process.env.EXCHANGE_NAME;
    await channel.assertExchange(exchangeName, 'direct', { durable: false });

    // Send messages to the chart_B
    const routingKey_q_B = process.env.ROUTING_KEY_Q_B;

    setInterval(() => {
      const message = Math.floor(Math.random() * 1000);
      // Send to chart_B
      channel.publish(exchangeName, routingKey_q_B, Buffer.from(`Message ${message} to chart B`));
      console.log(`Sent message ${message} to queue with routing key eq to ${routingKey_q_B}`);
    }, 20000);

  } catch (error) {
    console.log(error);
  }
}

produce_to_q_B();