# FinDash — Finance Dashboard

A modern, responsive financial dashboard built with React, TypeScript, and Tailwind CSS. Track spending, manage transactions, and gain insights into your financial health — all from a clean, intuitive interface.

## Live Demo

> Deploy on Vercel: `npm run build` produces a static bundle ready for any hosting platform.

## Setup Instructions

```bash
# Clone the repository
git clone <repo-url>
cd financialdashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`.

**Requirements:** Node.js 18+ and npm 9+.

## Overview of Approach

This project was designed as a **single-page frontend application** with no backend dependency. Data flows through a **mock API layer** that simulates async network calls, is managed by Zustand stores, and persisted in `localStorage`. All logic runs client-side. The goal was to build a dashboard that feels production-ready while demonstrating strong frontend fundamentals:

- **Component-driven architecture** — Small, focused components composed together. Reusable UI primitives (Button, Card, Modal, Badge, Input, Select) built from scratch without any component library.
- **Mock API integration** — A dedicated `src/api/mockApi.ts` layer wraps all data access in async functions with simulated 300-600ms network latency. Stores call the API for all CRUD operations. To connect a real backend, swap the function bodies with `fetch()` calls — zero component changes needed.
- **State management with Zustand** — Chosen over Redux/Context for minimal boilerplate and built-in persistence. Four small, focused stores (transactions, budgets, role, UI) instead of one monolithic store. Stores have `loading` and `initialized` flags for async data flow.
- **Derived data via custom hooks** — `useFilteredTransactions`, `useHealthScore`, `useAnomalies`, `useTopInsights` encapsulate complex computations with `useMemo` for performance.
- **CSS variable theming** — Tailwind CSS v4's `@theme` block defines all design tokens as CSS variables, enabling seamless dark/light mode transitions without class duplication.
- **No external component library** — Every UI component is hand-crafted to demonstrate CSS proficiency and keep the bundle lean.

## Features

### Core Requirements

**1. Dashboard Overview**
- 4 summary cards (Total Balance, Income, Expenses, Savings Rate) with animated counters and sparkline mini-charts
- Balance trend area chart (time-based visualization)
- Spending breakdown donut chart (categorical visualization)
- Recent transactions list with anomaly badges
- Quick text insights derived from transaction data

**2. Transactions Section**
- Full CRUD — add, edit, and delete transactions
- Search by description or category
- Filter by type (income/expense), category, and date range
- Multi-field sorting (date, amount, category) with ascending/descending
- Paginated list (15 per page with "Load more")
- CSV import with drag-and-drop, preview table, and row validation
- CSV export of filtered transactions

**3. Role-Based UI**
- Toggle between **Admin** (full access) and **Viewer** (read-only) via sidebar
- Admin: can add, edit, delete transactions, manage budgets, import CSV, use Quick Add
- Viewer: read-only access, only export is available
- All action buttons conditionally rendered based on role — no hidden elements, clean UI for each role

**4. Insights Section**
- Financial Health Score (detailed breakdown with advice)
- Monthly income vs expense comparison (bar chart)
- Top spending categories (horizontal bar chart)
- Spending trends by category over time (line chart)
- Stat cards: average daily expense, biggest transaction, most frequent category
- Budget goals with progress bars and over-budget alerts
- Anomaly summary showing flagged transactions

**5. State Management**
- **Zustand v5** with persist middleware
- `transactionStore` — transactions array, filters, async CRUD actions, loading/initialized state
- `roleStore` — current role (admin/viewer)
- `budgetStore` — budget goals per category, async CRUD actions
- `uiStore` — theme preference, sidebar state, command palette state
- All stores initialize via mock API on first load; subsequent visits hydrate from localStorage (cache-first strategy)
- Filters reset on page load; transactions, budgets, role, and theme persist across sessions

**6. UI and UX**
- Clean, readable design with consistent spacing and typography
- Fully responsive — desktop sidebar, mobile bottom navigation, adaptive grids
- Handles empty/no-data states gracefully with helpful messages and action buttons
- Smooth theme switching with 0.2s transitions
- Toast notifications for all user actions

### Innovative Features

**Natural Language Quick-Add Bar**
The dashboard features a prominent smart input bar at the top where users can type natural language to instantly add transactions. For example:
- `coffee 5.50 dining` → adds a $5.50 dining expense
- `salary 20000` → adds a $20,000 income transaction
- `bonus 1000` → detects "bonus" as income keyword, adds as income

The bar features:
- Animated cycling placeholder showing example inputs
- Live preview of the parsed transaction (description, amount, category, type)
- Glowing border effect when a valid transaction is detected
- Smart income detection using 35+ keywords (salary, bonus, refund, dividend, etc.)
- Works in both the dashboard bar and the Ctrl+K command palette

**Financial Weather Forecast**
A visual widget on the dashboard that maps the Financial Health Score to a weather metaphor:
- Sunny (score 80+) — "Your finances are shining bright!"
- Partly Cloudy (60-79) — "Looking good, a few areas to improve."
- Cloudy (40-59) — "Some clouds ahead — review your spending."
- Stormy (<40) — "Financial storm brewing — take action!"

Features a subtle animated weather icon and gradient background that changes with the score.

**Financial Health Score**
A computed 0-100 score based on four weighted components:
- Savings Rate (40%) — target 20% of income
- Consistency (20%) — monthly spending variance
- Diversity (20%) — spread across categories
- Trend (20%) — recent vs previous month direction

Displayed as an animated circular gauge with color-coded breakdown bars and personalized advice.

**Anomaly Detection**
Automatically flags transactions that exceed 2x the category average. Warning badges appear on transaction rows, and a dedicated anomaly summary on the Insights page shows the top 5 unusual transactions with multiplier badges.

**Budget Goals**
Set monthly spending limits per expense category. Progress bars transition from green (under budget) to yellow (80-99%) to red (over budget) with animated fills and overspend alerts.

### Polish & Optional Enhancements

| Feature | Status |
|---|---|
| Dark/Light mode | Done — System detection + manual toggle, flash-free loading |
| Data persistence | Done — localStorage via Zustand persist middleware |
| Mock API integration | Done — Async API layer with simulated latency, cache-first loading |
| Animations & transitions | Done — Page transitions, list animations, gauge fills, card hovers via Motion |
| CSV Export | Done — One-click filtered download |
| CSV Import | Done — Drag-and-drop with preview and validation |
| Advanced filtering | Done — Multi-field search, type/category/date-range filters, sort |
| Command Palette | Done — Ctrl+K with keyboard navigation, page search, transaction search, quick-add |
| Toast notifications | Done — Auto-dismiss success/error/warning toasts |
| Responsive design | Done — Desktop sidebar + mobile bottom nav + adaptive grids |
| Empty state handling | Done — Friendly messages with action buttons |

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript (strict) | Type safety throughout |
| Vite 8 | Build tool with SWC compiler |
| Tailwind CSS v4 | Utility-first styling with `@theme` CSS variables |
| Zustand v5 | Lightweight state management with persist middleware |
| Recharts v3 | Data visualization (area, bar, pie, line charts) |
| Motion | Animations and page transitions |
| React Router v7 | Client-side routing (3 routes) |
| Lucide React | Icon library (30+ icons) |
| date-fns | Date formatting and manipulation |
| clsx + tailwind-merge | Utility class merging |

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # Summary cards, charts, health gauge, weather widget, quick-add bar
│   ├── transactions/  # List, filters, forms, CSV import/export
│   ├── insights/      # Health score, budgets, anomalies, comparison charts
│   ├── layout/        # App layout, sidebar, header, mobile nav
│   └── ui/            # Reusable primitives (Button, Card, Modal, Badge, Input, Toast, etc.)
├── api/               # Mock API layer with simulated async network calls
├── pages/             # DashboardPage, TransactionsPage, InsightsPage
├── store/             # Zustand stores (transactions, budgets, role, UI) with async actions
├── hooks/             # Custom hooks (useTransactions, useInsights, useTheme, useInitializeData)
├── utils/             # Formatters, chart helpers, CSV parser, anomaly detection, health score
├── data/              # Mock transactions (89 entries), category configs, constants
└── types/             # TypeScript interfaces and type definitions
```

## Architecture Decisions

- **Zustand over Redux/Context** — Minimal boilerplate, no Provider wrapper needed, built-in persist middleware. Four small focused stores keep concerns separated.
- **Tailwind CSS v4 with `@theme`** — Design tokens defined as CSS variables in a single `@theme` block. No config file. CSS variables enable smooth dark/light transitions without duplicating classes.
- **Hand-crafted UI components** — No component library (shadcn, MUI, etc.). Every primitive is custom-built to demonstrate CSS and component design skills while keeping the bundle lean.
- **Computed hooks with `useMemo`** — All derived data (filtered transactions, health score, anomalies, insights) is computed in custom hooks and memoized for performance.
- **Frontend-only anomaly detection** — Simple statistical approach (2x category average threshold) that is effective for demo data without requiring ML overhead.
- **Natural language parsing** — Client-side text parsing with keyword matching for instant transaction creation. Demonstrates UX innovation without external NLP dependencies.
- **Mock API with cache-first loading** — All data access goes through `src/api/mockApi.ts` which simulates real network calls with randomized 300-600ms delays. Stores check localStorage first and only hit the API on first visit, mirroring a real cache-first strategy. Swapping to a real backend requires changing only the API file — stores and components remain untouched.

## Data Flow

```
App mount
  └─ useInitializeData()
       ├─ transactionStore.initialize()
       │    ├─ localStorage has data? → use cached (instant)
       │    └─ first visit? → api.fetchTransactions() → 300-600ms delay → store.set()
       └─ budgetStore.initialize()
            ├─ localStorage has data? → use cached (instant)
            └─ first visit? → api.fetchBudgets() → 300-600ms delay → store.set()

User actions (add/edit/delete)
  └─ Component calls store action
       └─ Store calls api.createTransaction() (async, simulated delay)
            └─ On resolve → store.set() → UI updates via Zustand subscription
```

## What I'd Add Next

- Real backend API integration (swap mock API bodies with fetch calls)
- Recurring transaction auto-detection
- Multi-currency support with conversion
- E2E tests with Playwright
- Data visualization export (chart screenshots)
- Budget notifications and alerts
