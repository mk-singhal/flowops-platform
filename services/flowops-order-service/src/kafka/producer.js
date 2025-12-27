const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["kafka:9092"], // Docker service name
});

const producer = kafka.producer();
let isProducerConnected = false;

const connectProducer = async () => {
  const MAX_RETRIES = 5;

  for (let i = 1; i <= MAX_RETRIES; i++) {
    try {
      await producer.connect();
      isProducerConnected = true;
      console.log("[Kafka] Producer connected");
      return;
    } catch (err) {
      console.error(`[Kafka] Connection attempt ${i} failed`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  console.error("[Kafka] Producer could not connect after retries");
};

const publishEvent = async (event) => {
  if (!isProducerConnected) {
    console.warn("[Kafka] Producer not connected, skipping event:", event.eventType);
    return;
  }

  try {
    await producer.send({
      topic: "order-events",
      messages: [
        {
          key: event.eventId,
          value: JSON.stringify(event),
        },
      ],
    });

    console.log("[Kafka] Event published:", event.eventType);
  } catch (err) {
    console.error("[Kafka] Failed to publish event", err);
  }
};

module.exports = {
  connectProducer,
  publishEvent,
};
