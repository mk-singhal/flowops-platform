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