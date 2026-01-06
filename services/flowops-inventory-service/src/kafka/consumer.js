const { Kafka } = require("kafkajs");
const inventoryRepo = require("../repositories/inventory.repository");

const kafka = new Kafka({
  clientId: "inventory-service",
  brokers: ["kafka:9092"], // Docker service name
});

const consumer = kafka.consumer({
  groupId: "inventory-service-group",
});

const handleOrderCreated = async (items) => {
  for (const item of items) {
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
  }
};

const handleOrderCancelled = async (items) => {
  for (const item of items) {
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
  }
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
        try {
          const event = JSON.parse(message.value.toString());

          console.log("[Kafka] Event received:", {
            topic,
            partition,
            eventType: event.eventType,
          });

          const { eventType, payload } = event;

          if (!payload || !payload.items) {
            console.warn("[Kafka] Invalid event payload, skipping");
            return;
          }

          if (eventType === "ORDER_CREATED") {
            await handleOrderCreated(payload.items);
          }

          if (eventType === "ORDER_CANCELLED") {
            await handleOrderCancelled(payload.items);
          }
        } catch (err) {
          console.error("[Kafka] Failed to process inventory event", err);

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
