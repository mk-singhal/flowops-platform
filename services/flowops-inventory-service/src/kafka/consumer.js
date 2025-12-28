const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "inventory-service",
  brokers: ["kafka:9092"], // Docker service name
});

const consumer = kafka.consumer({
  groupId: "inventory-service-group",
});

const startConsumer = async () => {
  try {
    await consumer.connect();
    console.log("[Kafka] Inventory consumer connected");

    await consumer.subscribe({
      topic: "order-events",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        const event = JSON.parse(value);

        console.log("[Kafka] Event received:", {
          topic,
          partition,
          eventType: event.eventType,
          payload: event.payload,
        });
      },
    });
  } catch (err) {
    console.error("[Kafka] Inventory consumer failed", err);
  }
};

module.exports = {
  startConsumer,
};
