# ⭐ STAR Notes – “What hardships did you face?”

These notes follow the **STAR (Situation, Task, Action, Result)** format  
and are meant for quick revision before interviews.

---

## 1️⃣ Managing server state without a backend

**S (Situation)**  
I was building an order management system, but the backend APIs were not ready yet.

**T (Task)**  
I still needed to implement and test create, edit, and cancel order flows without blocking frontend progress.

**A (Action)**  
I created an in-memory mock API layer that simulated async backend behavior and integrated it using React Query, treating it like a real server.

**R (Result)**  
I was able to fully build and test all workflows, and later the real backend can be plugged in without changing UI logic.

---

## 2️⃣ Separating client state vs server state

**S (Situation)**  
Initially, order data was handled using local React state and `useEffect`.

**T (Task)**  
As the app grew, I needed a scalable way to manage server data and avoid manual refetch logic.

**A (Action)**  
I migrated order data to React Query, replaced `useEffect` with `useQuery`, and handled updates using mutations and query invalidation.

**R (Result)**  
The code became cleaner, more predictable, and easier to scale, with fewer bugs related to stale data.

---

## 3️⃣ Handling create vs edit logic cleanly

**S (Situation)**  
The create and edit order flows initially shared a single mutation that depended on UI state.

**T (Task)**  
I needed to avoid coupling business logic with component state to make the code more maintainable.

**A (Action)**  
I split the mutation into separate create and update mutations and made the decision explicit in the submit handler.

**R (Result)**  
The logic became clearer, easier to reason about, and more robust against future refactors.

---

## 4️⃣ UI lifecycle & validation edge cases

**S (Situation)**  
While editing an order, a validation error message briefly appeared during form submission.

**T (Task)**  
I needed to understand and fix the issue without introducing hacks or poor UX.

**A (Action)**  
I identified a React lifecycle timing issue where form state reset before unmount and gated validation messages based on dialog open state.

**R (Result)**  
The flicker was eliminated, and the form behaved correctly under all submission scenarios.

---

## 5️⃣ Enforcing business rules without backend validation

**S (Situation)**  
Since there was no backend enforcement yet, invalid user actions were possible at the UI level.

**T (Task)**  
I needed to ensure users could only perform valid actions based on order status.

**A (Action)**  
I enforced business rules in the UI by disabling edit and cancel actions for completed or cancelled orders and preventing duplicate submissions.

**R (Result)**  
The application behaved correctly even without backend validation, and the UI was production-ready.

---

*Most challenges were around managing server-like state, clean mutation design, and handling subtle UI lifecycle issues without a real backend.*

---

## ⭐ STAR Notes – Order Service (Backend)

## 6️⃣ Designing backend validation vs frontend payloads

**S (Situation)**  
While integrating the frontend with the Order Service, valid-looking requests were failing backend validation.

**T (Task)**  
I needed to identify why the API was rejecting requests and fix the frontend–backend contract without weakening validation.

**A (Action)**  
I realized the frontend was sending full domain objects instead of API-specific payloads, so I introduced DTO-style request shapes and kept Joi validation strict to reject unknown fields.

**R (Result)**  
The API contract became clearer, integration bugs were eliminated, and the backend was protected from incorrect client data.

---

## 7️⃣ Handling derived fields in MongoDB models

**S (Situation)**  
Order totals were derived from item data but were also required fields in the database schema.

**T (Task)**  
I needed to ensure totals were always correct without trusting the client or duplicating logic across controllers.

**A (Action)**  
I moved total calculation into a Mongoose model hook so totals are computed server-side before persistence.

**R (Result)**  
Data integrity improved, controllers became simpler, and future consumers can rely on consistent order data.

---

## 8️⃣ Writing API tests without breaking development data

**S (Situation)**  
Initial API tests interfered with development data by clearing the database after execution.

**T (Task)**  
I needed isolated, repeatable tests that were safe to run locally.

**A (Action)**  
I introduced a separate test database, environment-based configuration, and ensured each test seeded and cleaned up its own data.

**R (Result)**  
Tests became deterministic, safe to run anytime, and closer to real-world backend testing practices.

---

## 9️⃣ Updating nested MongoDB documents safely

**S (Situation)**  
Order updates started failing because MongoDB-generated `_id` fields inside nested items were being sent back to the API.

**T (Task)**  
I needed to allow updates without loosening backend validation rules.

**A (Action)**  
I stripped subdocument `_id` fields at the API boundary before sending update payloads.

**R (Result)**  
Validation remained strict, updates worked correctly, and the API contract stayed clean.

---

*Most backend challenges were around strict validation, clean API boundaries, and protecting the service from incorrect client behavior.*
