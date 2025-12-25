# Performance Benchmarks

## Orders API – Redis Caching Impact

### Endpoint
GET /orders?page=1&limit=10

### Test Method
- Browser HAR capture
- Same environment & dataset
- Redis enabled vs disabled

### Results

| Metric | Without Redis | With Redis |
|------|---------------|------------|
| Avg response time | ~16.5 ms | ~9.6 ms |
| P95 latency | ~27 ms | ~18 ms |
| Avg server wait | ~3.5 ms | ~1.7 ms |

### Observations
- ~40% reduction in average latency
- ~50% reduction in server processing time
- MongoDB reads avoided on cache hits

### Conclusion
Redis read-through caching significantly improves read performance while reducing database load.
