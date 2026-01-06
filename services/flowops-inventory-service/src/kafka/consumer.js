const { Kafka } = require("kafkajs");
const inventoryRepo = require("../repositories/inventory.repository");
const mongoose = require("mongoose");

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
        console.warn(
          `[Inventory] Insufficient stock for SKU=${sku}, required=${qty}, available=${inventory.availableQty}`
        );
        continue;
      }

      await inventoryRepo.updateQuantities(
        sku,
        inventory.availableQty - qty,
        inventory.reservedQty + qty
      );

      console.log(`[Inventory] Reserved ${qty} units for SKU=${sku}`);
    } catch (err) {
      console.error(`[Inventory] Failed to update SKU=${item.sku}`, err);
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
        console.warn(`[Inventory] No inventory found for SKU=${sku}`);
        continue;
      }

      await inventoryRepo.updateQuantities(
        sku,
        inventory.availableQty + qty,
        Math.max(inventory.reservedQty - qty, 0)
      );

      console.log(`[Inventory] Released ${qty} units for SKU=${sku}`);
    } catch (err) {
      console.error(`[Inventory] Failed to update SKU=${item.sku}`, err);
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
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // Mongo not ready → pause consumption
        if (mongoose.connection.readyState !== 1) {
          console.warn("[Inventory] Mongo not connected, pausing consumption");

          consumer.pause([{ topic, partitions: [partition] }]);

          setTimeout(() => {
            if (mongoose.connection.readyState === 1) {
              console.log(
                "[Inventory] Mongo reconnected, resuming consumption"
              );
              consumer.resume([{ topic, partitions: [partition] }]);
            }
          }, 5000);

          return;
        }

        const event = JSON.parse(message.value.toString());

        if (!isValidEvent(event)) {
          console.error("[Kafka] Invalid event, skipping");
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

process.on("SIGTERM", async () => {
  console.log("[Kafka] Inventory consumer shutting down...");
  await consumer.disconnect();
  process.exit(0);
});

module.exports = {
  startConsumer,
};
