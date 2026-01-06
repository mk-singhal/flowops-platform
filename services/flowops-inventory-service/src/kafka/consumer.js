const { Kafka } = require("kafkajs");
const inventoryRepo = require("../repositories/inventory.repository");
const mongoose = require("mongoose");
const logger = require("../utils/logger");
let isPaused = false;

const kafka = new Kafka({
  clientId: "inventory-service",
  brokers: ["kafka:9092"], // Docker service name
});

const consumer = kafka.consumer({
  groupId: "inventory-service-group",
});

const handleOrderCreated = async (items) => {
  for (const item of items) {
    try {
      const { sku, qty } = item;

      let inventory = await inventoryRepo.findBySku(sku);

      // Create inventory record if not present
      if (!inventory) {
        inventory = await inventoryRepo.createInventory({
          sku,
          availableQty: 0,
          reservedQty: 0,
        });
      }

      if (inventory.availableQty < qty) {
        logger.warn("Inventory stock insufficient", {
          sku,
          qty,
          available: inventory.availableQty,
        });
        continue;
      }

      await inventoryRepo.updateQuantities(
        sku,
        inventory.availableQty - qty,
        inventory.reservedQty + qty
      );

      logger.info("Inventory reserved", {
        sku,
        qty,
      });
    } catch (err) {
      logger.error("Inventory update failed", {
        error: err.message,
      });

      throw err; // force retry of entire message
    }
  }
};

const handleOrderCancelled = async (items) => {
  for (const item of items) {
    try {
      const { sku, qty } = item;

      const inventory = await inventoryRepo.findBySku(sku);
      if (!inventory) {
        logger.warn("Inventory SKU not found", {
          sku,
        });
        continue;
      }

      await inventoryRepo.updateQuantities(
        sku,
        inventory.availableQty + qty,
        Math.max(inventory.reservedQty - qty, 0)
      );

      logger.info("Inventory released", {
        sku,
        qty,
      });
    } catch (err) {
      logger.error("Inventory update failed", {
        error: err.message,
      });

      throw err; // force retry of entire message
    }
  }
};

const isValidEvent = (event) => {
  return (
    event &&
    typeof event.eventType === "string" &&
    event.payload &&
    Array.isArray(event.payload.items)
  );
};

const startConsumer = async () => {
  try {
    await consumer.connect();
    console.log("[Kafka] Inventory consumer connected");

    await consumer.subscribe({
      topic: "order-events",
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // Mongo not ready → pause consumption
        if (mongoose.connection.readyState !== 1) {
          if (!isPaused) {
            logger.warn("Mongo unavailable, pausing consumption", {
              topic,
              partition,
            });

            consumer.pause([{ topic, partitions: [partition] }]);
            isPaused = true;
            throw new Error("Mongo unavailable");
          }
          return;
        }

        const event = JSON.parse(message.value.toString());

        logger.info("Kafka event received", {
          eventType: event.eventType,
          topic,
          partition,
          offset: message.offset,
        });

        if (!isValidEvent(event)) {
          logger.error("Kafka skipping invalid event", {
            eventType: event.eventType,
            topic,
            partition,
          });
          return;
        }

        try {
          if (event.eventType === "ORDER_CREATED") {
            await handleOrderCreated(event.payload.items);
          }

          if (event.eventType === "ORDER_CANCELLED") {
            await handleOrderCancelled(event.payload.items);
          }
        } catch (err) {
          console.error("[Kafka] Inventory update failed", err);
          throw err; // real processing errors
        }
      },
    });
  } catch (err) {
    console.error("[Kafka] Inventory consumer failed to start", err);
  }
};

mongoose.connection.on("connected", () => {
  if (isPaused) {
    logger.info("Mongo reconnected, resuming Kafka consumption");

    consumer.resume([{ topic: "order-events", partitions: [0] }]);
    isPaused = false;
  }
});

process.on("SIGTERM", async () => {
  console.log("[Kafka] Inventory consumer shutting down...");
  await consumer.disconnect();
  process.exit(0);
});

module.exports = {
  startConsumer,
};
