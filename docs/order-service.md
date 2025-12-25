# FlowOps Order Service

The Order Service is the backend service responsible for managing orders in
the FlowOps platform.

It exposes REST APIs for creating, reading, updating, and cancelling orders
and acts as the source of truth for all order-related data.

---

## 🎯 Purpose

This service demonstrates how a backend microservice:

- Owns a single business domain (Orders)
- Enforces business rules at the service level
- Exposes stable APIs consumed by an admin frontend
- Prepares the system for Redis caching and Kafka-based workflows

---

## 🧱 Tech Stack

- Node.js + Express
- MongoDB (Mongoose)
- Joi for request validation
- Jest + Supertest for API testing

---

## 🖥️ Core Responsibilities

- Create orders
- Fetch orders with pagination
- Update orders (with restrictions)
- Cancel orders via status transitions
- Validate all incoming requests
- Compute derived fields like total amount on the server

---

## 🔀 Order Rules

- Completed orders cannot be edited or cancelled
- Cancelled orders are immutable
- Order totals are always computed server-side

---

## 🌐 API Endpoints
```
POST /orders
GET /orders
PUT /orders/:id
DELETE /orders/:id
```

---

## Project Structure

```
src/
├── controllers/
├── routes/
├── models/
├── validators/
├── middlewares/
└── server.js
```

---

## Local Development

```
npm install
npm run dev
```

### Service runs on:

```
http://localhost:5001
```

---

## Redis Usage

This service uses Redis as a performance and coordination layer.

- Read-through caching for paginated order reads
- Distributed locking to prevent concurrent updates
- MongoDB remains the source of truth
- Reads fall back to MongoDB if Redis is unavailable
- Writes fail closed if Redis locking is unavailable

See [Redis Architecture](redis-architecture.md) for full details.

---

## Notes

- The service does not handle inventory updates
- Caching and async workflows are introduced in later milestones
- Designed to resemble a real internal backend service, not a demo API

---

## Related Docs

- [Project Overview](../README.md)
- [Frontend Docs](frontend.md)
- [Interview Notes (STAR Format)](STAR_INTERVIEW_NOTES.md)
