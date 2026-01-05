# FlowOps Frontend

The FlowOps frontend is a **React-based admin dashboard** designed to manage
orders and inventory in an event-driven system.

It focuses on **data-heavy UI**, **operational workflows**, and **real-world
enterprise patterns** rather than demo-style pages.

---

## 🎯 Purpose

The frontend demonstrates how a modern operations dashboard:

- Consumes async, event-driven backend APIs
- Handles large datasets with pagination
- Provides clear operational visibility
- Remains scalable and maintainable

It is intentionally built to resemble **enterprise internal tools** rather than
marketing websites.

---

## 🧱 Tech Stack

- **Framework:** React
- **Build Tool:** Vite
- **UI Library:** Material UI (MUI)
- **State Management:** Local state + React Query (where applicable)
- **Routing:** React Router
- **Language:** TypeScript
- **Styling:** MUI system & components

---

## 🖥️ Key Features

### Order Management
- Create, view, edit, and cancel orders
- Status-based UI (Cancelled, Pending, Completed)
- Business-rule-driven UI restrictions (e.g. no edit on completed orders)

### Inventory Dashboard

The Inventory dashboard is a read-only, event-driven view of stock levels.

#### Key characteristics:
- Paginated views for large datasets
- Optimized rendering for admin-style tables
- Read-heavy design aligned with Redis-backed APIs

Inventory updates are expected to flow as:
```
Orders → Kafka Events → Inventory Service → Inventory UI
```

The UI does not assume real-time consistency and handles missing or delayed
data gracefully.

### Operational UX
- Dialog-driven workflows
- Form validation and controlled inputs
- Clear separation between view and data logic

---

## 🧭 Frontend Architecture

The frontend follows a **feature-oriented structure**:

```src/
├── components/     # Reusable UI components
├── pages/          # Route-level screens
├── api/            # API interaction layer
├── hooks/          # React Query hooks & server-state logic
├── constants/      # Shared UI & business thresholds
├── types/          # Shared TypeScript types
└── App.tsx         # Route definitions
```

### Architectural Principles
- Pages compose UI, not business logic
- API calls are isolated in the api/ layer
- Server state is handled via React Query
- Components remain stateless and reusable
- UI is defensive against backend unavailability

---

## 🔀 Routing Model (SPA)

The frontend is a **Single Page Application (SPA)** using React Router.

Routes include:
- /
- /orders
- /inventory

This allows:
- Fast navigation
- No full page reloads
- Clear separation between frontend and backend concerns

---

## 🌐 API Communication

The frontend communicates with backend services via HTTP APIs.

Characteristics:
- Backend services are treated as black boxes
- No assumptions about Kafka, Redis, or DB internals
- APIs may return partial or delayed data

This mirrors real-world frontend-backend contracts.

---

## 🧪 Development Setup

### Prerequisites
- Node.js (18+)
- npm

### Install Dependencies
```
npm install
```
### Run in Development Mode
```
npm run dev
```
### The app will be available at:
```
http://localhost:5173
```

---

## 🏗️ Production Build

To generate a production build:
```
npm run build
```
This outputs static assets into:
```
dist/
```
These assets are served via NGINX in production.

---

## 🧠 Design Decisions

### Why Material UI?
- Enterprise-ready component library
- Strong accessibility defaults
- Theming support
- Widely used in internal tools

### Why SPA?
- Faster user experience
- Decoupled backend services
- Easier to scale frontend independently

### Why Read-Only Inventory UI?
- Inventory is modified by backend workflows
- Prevents accidental state corruption
- Reflects real-world operational systems

### Why TypeScript?
- Safer refactors
- Clear contracts between layers
- Better long-term maintainability

---

## 🚫 Non-Goals

The frontend intentionally does not focus on:
- Animations or visual flair
- SEO optimization
- Public-facing UX

The goal is **operational clarity**, not marketing.

---

## 📚 Related Documentation

- [Project Overview](../README.md)
- [Order Service Docs](order-service.md)
- [Interview Notes (STAR Format)](STAR_INTERVIEW_NOTES.md)
