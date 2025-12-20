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
- Paginated views for large datasets
- Optimized rendering for admin-style tables
- Read-heavy design aligned with Redis-backed APIs

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
├── types/          # Shared TypeScript types
└── App.tsx         # Route definitions
```

### Key Principles
- Pages handle composition, not logic
- Services abstract API calls
- Types are centralized and reusable
- UI components remain stateless where possible

---

## 🔀 Routing Model (SPA)

The frontend is a **Single Page Application (SPA)**.

Routes such as:
/dashboard
/orders
/inventory

are handled entirely on the client using React Router.

This allows:
- Fast navigation
- No full page reloads
- Clear separation between frontend and backend concerns

---

## 🌐 API Communication

The frontend communicates with backend services via HTTP APIs.

Characteristics:
- Backend is treated as a black box
- No frontend assumptions about implementation
- Backend endpoints may internally use Kafka / Redis

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

(See _docs/frontend.md_ for Docker and NGINX details.)

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
- [Interview Notes (STAR Format)](STAR_INTERVIEW_NOTES.md)
