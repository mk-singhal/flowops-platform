const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["kafka:9092"], // Docker service name
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("[Kafka] Producer connected");
  } catch (err) {
    console.error("[Kafka] Producer connection failed", err);
  }
};

const publishEvent = async (event) => {
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
