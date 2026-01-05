# 📘 Event-Driven Design Notes  
## Order Service & Inventory Service

This document captures the **explicit design decisions** and **intentional trade-offs**
used in the **Order Service** and **Inventory Service**.

The goal is to make system behavior **clear under failure conditions**, especially
around Kafka availability, data consistency, and recovery.

---

## 🧾 Order Service

### Source of Truth
- The **Order Service database** is the **only authoritative source of truth** for orders.
- An order **must be persisted successfully** regardless of downstream system availability.

---

### Kafka Publishing Strategy
- The Order Service publishes domain events such as:
  - `ORDER_CREATED`
  - `ORDER_CANCELLED`
- Kafka publishing follows a **fail-open strategy**:
  - If Kafka is unavailable, order creation **still succeeds**.
  - Order creation is **never blocked** by Kafka outages.

---

### Implication
- If Kafka is down at publish time:
  - The order exists in the database
  - The corresponding Kafka event **may not be published**
- Downstream services may temporarily miss those events.

This is an **explicit and accepted trade-off**.

---

## 📦 Inventory Service

### Role & Responsibility
- The Inventory Service **does not own business truth**.
- Inventory state is a **derived projection** built from order lifecycle events.
- Inventory is **eventually consistent** with orders.

---

### MongoDB Usage
MongoDB stores the **latest known inventory snapshot**, including:
- `sku`
- `availableQty`
- `reservedQty`
- timestamps

MongoDB does **not** store:
- Order history
- Event history
- Business intent

**MongoDB is a cache of derived state, not a source of truth.**

---

### Kafka Consumption Model
- Inventory Service consumes order events from Kafka using **at-least-once delivery**.
- The same event **may be delivered multiple times**.
- Inventory updates **must be idempotent**.

**Rule:**  
Applying the same event more than once must not corrupt inventory state.

---

### Offset & Persistence Ordering
Inventory Service follows a strict processing order:

1. Apply inventory changes to MongoDB
2. Commit Kafka offsets **only after** successful persistence

This guarantees that service crashes do not silently drop updates.

---

## ⚖️ Consistency vs Availability

- **Order Service** prioritizes **availability**
- **Inventory Service** tolerates **temporary inconsistency**
- Strong real-time consistency between orders and inventory is **not guaranteed**

This trade-off is **intentional** and aligns with real-world distributed systems.

---

## 🚨 Event Loss Consideration

- Kafka does **not** recover events that were never published.
- With fail-open publishing, Kafka downtime can cause **missed events**.

---

### Planned Mitigation (Future)
To prevent permanent event loss, the Order Service should introduce the
**Transactional Outbox Pattern**:

- Persist events in the Order database
- Publish them asynchronously to Kafka
- Retry publishing when Kafka becomes available

This guarantees **zero event loss during Kafka outages**.

---

## 🔄 Recovery & Reconciliation

Inventory inconsistencies are **recoverable**, not permanent.

Recovery strategies include:
- Kafka event replay
- Reconciliation from the Order Service database
- Inventory rebuild jobs

Inventory correctness is **recoverable over time**, not guaranteed instantly.

---

## 🧠 System Principle

> **Order Service guarantees durability and correctness of orders.  
> Inventory Service provides an eventually consistent projection derived from order events.**

---

## 📌 Why This Matters

These design decisions:
- Make failure modes explicit
- Avoid hidden coupling between services
- Preserve system availability under partial failures
- Reflect patterns used in real production systems
