# Kafka Architecture – FlowOps

Kafka is used to enable asynchronous, event-driven communication between services.
It is not used as a source of truth.

---

## Purpose

- Decouple services
- Avoid synchronous service-to-service calls
- Ensure Order Service is not blocked by downstream failures

MongoDB remains the system of record.

---

## Architecture

Order Service → Kafka → Inventory Service

- Order Service publishes events
- Inventory Service consumes events
- Services do not call each other directly

---

## Topics

### `order-events`

**Producer**
- Order Service

**Consumer**
- Inventory Service

**Events**
- ORDER_CREATED
- ORDER_CANCELLED

---

## Event Flow

### Order Creation
1. Order is persisted in MongoDB
2. API responds to client
3. ORDER_CREATED event is published to Kafka

### Inventory Reaction
1. Inventory Service consumes event
2. Event is logged (Milestone 7)
3. Inventory logic implemented in Milestone 8

---

## Failure Handling

- Order Service does not depend on Kafka availability
- Events are skipped if Kafka is down
- Producer retries connection in background
- Consumer reconnects automatically
- At-least-once delivery is accepted

---

## Design Decisions

- Kafka used only for notifications
- Business correctness handled by MongoDB
- Ordering guaranteed per partition, not globally
- Inventory idempotency deferred to next milestone
