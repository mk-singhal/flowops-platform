# Kafka Event Schema

This document defines the Kafka event contracts used in FlowOps.
Each topic has its own event contract and supported event types.

---

## Topics

### Topic: `order-events`

**Purpose**  
Carries order lifecycle events emitted by the Order Service.

**Producers**
- Order Service

**Consumers**
- Inventory Service (Milestone 7 – skeleton consumer)
- Inventory Service (Milestone 8 – full inventory logic)

**Supported Event Types**
- ORDER_CREATED
- ORDER_CANCELLED

**Partitioning Strategy**
- Single partition (for now)

**Delivery Semantics**
- At-least-once delivery

**Ordering Guarantee**
- Events are ordered per partition

---

#### Base Event Structure

All events published to the `order-events` topic must follow this structure:

```json
{
  "eventId": "string",
  "eventType": "string",
  "timestamp": "string",
  "payload": {}
}
```

| Field     | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| eventId   | string | Unique identifier for the event (UUID) |
| eventType | string | Type of the event                      |
| timestamp | string | Event creation time in ISO-8601 (UTC)  |
| payload   | object | Event-specific data                    |

---

#### Event Types 
### ORDER_CREATED

#### Description
Emitted after an order is successfully created and persisted.

#### Payload Structure

```json
{
  "orderId": "string",
  "items": [
    {
      "sku": "string",
      "qty": "number"
    }
  ]
}
```

#### Example Event

```json
{
  "eventId": "e1b7c2f0-8d41-4b9a-b9f1-3d0a2f7a9c21",
  "eventType": "ORDER_CREATED",
  "timestamp": "2025-01-01T10:00:00Z",
  "payload": {
    "orderId": "ORD-123",
    "items": [
      { "sku": "SKU-1", "qty": 2 },
      { "sku": "SKU-2", "qty": 1 }
    ]
  }
}
```

---

### ORDER_CANCELLED

#### Description
Emitted when an existing order is cancelled.

#### Payload Structure

```json
{
  "orderId": "string"
}
```

#### Example Event

```json
{
  "eventId": "a9f3d12e-27a5-4d9e-b8b1-8b62a7c42e91",
  "eventType": "ORDER_CANCELLED",
  "timestamp": "2025-01-01T10:05:00Z",
  "payload": {
    "orderId": "ORD-123"
  }
}
```
