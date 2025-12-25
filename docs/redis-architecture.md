# Redis Architecture & Caching Strategy

## Overview

Redis is used in FlowOps as a **performance optimization and coordination layer** for the Order Service. MongoDB remains the **system of record** for all order data. Redis is never treated as a source of truth.

The primary goals of introducing Redis are:
- Reduce read latency for frequently accessed order data
- Lower MongoDB read load
- Prevent concurrent updates to the same order in a distributed setup
- Handle Redis failures predictably without data corruption

---

## Why Redis Was Introduced

Before Redis integration:
- Every `GET /orders` request hit MongoDB
- Read latency increased with load
- Concurrent order updates across instances could race

Redis addresses these issues by:
- Serving hot reads from in-memory cache
- Acting as a distributed locking mechanism
- Offloading read pressure from MongoDB

---

## High-Level Architecture

```
Client
  ↓
Order Service
  ├─ Read path: Redis → MongoDB fallback
  ├─ Write path: Redis lock → MongoDB
  └─ Cache invalidation on mutations
```

Key principles:
- MongoDB is always the source of truth
- Redis improves performance and safety, but never availability
- Redis failures must not corrupt data

---

## Caching Strategy

### Pattern

**Read-through cache**

The service first checks Redis for cached data. If the cache is missing or unavailable, the request falls back to MongoDB, and the result is stored in Redis for subsequent requests.

### Cached Endpoint

```
GET /orders?page={page}&limit={limit}
```

### Cache Flow

1. Generate cache key based on page and limit
2. Attempt to read from Redis
3. On cache hit → return response
4. On cache miss or Redis failure → query MongoDB
5. Store result in Redis with TTL

### TTL

- **60 seconds**

TTL ensures:
- Bounded memory usage
- Automatic expiry of stale data
- Eventual consistency without complex invalidation logic

---

## Cache Invalidation Strategy

Cache invalidation is performed on **any order mutation**:

- `POST /orders`
- `PUT /orders/:id`
- `DELETE /orders/:id`

All cached order list entries are invalidated to guarantee correctness.

This strategy favors **correctness over cache granularity**.

---

## Redis Key Design & Namespacing

All Redis keys follow a strict naming convention to avoid collisions and enable safe migrations.

### Global Format

```
{service}:{version}:{resource}:{scope}:{identifier}
```

### Service Namespace

```
flowops:order-service:v1
```

### Cache Keys

Paginated order list:

```
flowops:order-service:v1:orders:list:page:{page}:limit:{limit}
```

Single order entity (future use):

```
flowops:order-service:v1:orders:entity:{orderId}
```

### Lock Keys

```
flowops:order-service:v1:locks:order:{orderId}
```

Versioning allows cache schema changes without mass deletions or downtime.

---

## Distributed Locking Strategy

Redis is used to prevent **concurrent updates to the same order** across multiple service instances.

### Lock Mechanism

```
SET key value NX EX ttl
```

- `NX`: ensures only one lock owner
- `EX`: ensures automatic expiry
- TTL: **10 seconds**

### Lock Lifecycle

1. Acquire lock before reading/modifying order
2. Perform MongoDB update
3. Release lock in `finally` block

Locks are scoped per order ID and prevent race conditions during updates and cancellations.

---

## Failure Handling & Fallback Strategy

Redis is treated as a **best-effort dependency** for reads and a **critical dependency** for writes.

### Read Behavior

- Redis available → serve cached data
- Redis unavailable → fall back to MongoDB

### Write Behavior (Fail-Closed)

- Redis lock available → proceed with update
- Lock held → return `409 Conflict`
- Redis unavailable → return `503 Service Unavailable`

This **fail-closed strategy** ensures strong consistency and prevents unsafe concurrent mutations.

### Summary Table

| Operation | Redis Down Behavior |
|--------|---------------------|
| GET /orders | MongoDB fallback |
| POST /orders | Succeeds |
| PUT /orders/:id | 503 – update blocked |
| DELETE /orders/:id | 503 – cancel blocked |

---

## Performance Impact

Redis caching provides measurable performance improvements:

- ~40% reduction in average read latency
- ~50% reduction in backend processing time
- Significant reduction in MongoDB read traffic

Benchmarks were captured using HAR-based analysis.

See [Performance](performance.md) for detailed results.

---

## Trade-offs & Future Improvements

### Current Trade-offs

- Cache invalidation is coarse-grained
- Writes are blocked if Redis locking is unavailable
- No fine-grained cache eviction

### Possible Improvements

- Fine-grained invalidation by affected pages
- Redis metrics (hit/miss ratio, lock contention)
- Retry strategies for lock acquisition
- Observability dashboards

---

## Summary

Redis in FlowOps is used intentionally and conservatively:

- MongoDB remains the source of truth
- Redis accelerates reads and coordinates writes
- Failures are handled explicitly
- Consistency is prioritized over availability for mutations

This design ensures predictable behavior, strong data integrity, and measurable performance gains.

