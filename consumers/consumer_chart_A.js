require('dotenv').config();

const amqp = require('amqplib');

async function consume_from_q_A() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    
    // Create a channel
    const channel = await connection.createChannel();
    
    // Create the direct exchange
    const exchangeName = process.env.EXCHANGE_NAME;
    await channel.assertExchange(exchangeName, 'direct', { durable: false });
    
    // Create the chart_A queue
    const queueName = 'chart_A';
    const assertQueue = await channel.assertQueue(queueName, { durable: false });
    
    // Bind the queue to the exchange with the routing key
    const routingKey_q_A = process.env.ROUTING_KEY_Q_A;
    await channel.bindQueue(assertQueue.queue, exchangeName, routingKey_q_A);
    
    // Start consuming messages
    console.log(`Consumer started. Waiting for messages in queue ${queueName}...`);
    channel.consume(assertQueue.queue, (message) => {
      console.log(`Received message: ${message.content.toString()}`);
    }, { noAck: true });

  } catch (error) {
    console.log(error);
  }
}

consume_from_q_A();