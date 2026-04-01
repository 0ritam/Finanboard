# FinDash — Finance Dashboard

A modern, responsive financial dashboard built with React, TypeScript, and Tailwind CSS. Track spending, manage transactions, and gain insights into your financial health — all from a clean, intuitive interface.

## Features

### Core
- **Dashboard Overview** — Summary cards with animated counters and sparkline mini-charts, balance trend area chart, spending breakdown donut chart, recent transactions, and quick insights
- **Transaction Management** — Full CRUD with search, filtering (type, category, date range), sorting, and pagination
- **Role-Based UI** — Toggle between Admin (full access) and Viewer (read-only) via sidebar dropdown. Action buttons conditionally rendered based on role
- **Financial Insights** — Monthly income vs expense comparison, top spending categories, spending trends over time, and stat cards

### Innovations
- **Financial Health Score** — A computed 0-100 score based on savings rate, spending consistency, category diversity, and trend direction. Displayed as an animated circular gauge with detailed breakdown
- **Budget Goals** — Set monthly budget limits per expense category. Progress bars with color transitions (green → yellow → red) and over-budget alerts
- **Anomaly Detection** — Automatically flags transactions that are 2x+ the category average. Warning badges in transaction list and dedicated summary on Insights page
- **CSV Import** — Drag-and-drop CSV files to bulk import transactions. Preview table with validation before confirming

### Polish
- **Dark/Light Mode** — System preference detection with manual toggle. Flash-free on load via synchronous script in HTML
- **Command Palette** — `Ctrl+K` opens a VS Code-style search overlay. Navigate pages and search transactions with keyboard
- **CSV Export** — One-click download of filtered transactions
- **Smooth Animations** — Page transitions, list item animations, card hover effects, and animated gauges via Motion
- **Responsive Design** — Desktop sidebar, mobile bottom navigation, adaptive layouts
- **Toast Notifications** — Success/error/warning toasts for all actions
- **localStorage Persistence** — Transactions, budgets, role, and theme persist across sessions

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript (strict) | Type safety |
| Vite | Build tool (SWC compiler) |
| Tailwind CSS v4 | Utility-first styling with CSS theme variables |
| Zustand v5 | Lightweight state management with persist middleware |
| Recharts v3 | Data visualization (area, bar, pie, line charts) |
| Motion | Animations and transitions |
| React Router v7 | Client-side routing |
| Lucide React | Icon library |
| date-fns | Date formatting |

## Getting Started

```bash
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

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # Summary cards, charts, health gauge
│   ├── transactions/  # List, filters, forms, CSV import
│   ├── insights/      # Health score, budgets, anomalies, charts
│   ├── layout/        # Sidebar, header, mobile nav
│   └── ui/            # Reusable primitives (Button, Card, Modal, etc.)
├── pages/             # DashboardPage, TransactionsPage, InsightsPage
├── store/             # Zustand stores (transactions, budgets, role, UI)
├── hooks/             # Custom hooks (useTransactions, useInsights, useTheme)
├── utils/             # Formatters, chart helpers, CSV parser, anomaly detection
├── data/              # Mock transactions, category configs, constants
└── types/             # TypeScript interfaces
```

## Architecture Decisions

- **Zustand over Redux/Context** — Minimal boilerplate, no Provider wrapper, built-in persist middleware. Three small focused stores instead of one monolithic store
- **Tailwind CSS v4** — New `@theme` block in CSS for design tokens, no config file. CSS variables enable smooth dark/light transitions
- **Hand-crafted UI components** — No component library (shadcn, MUI). Demonstrates CSS proficiency and keeps the bundle lean
- **Computed hooks** — `useFilteredTransactions`, `useInsights`, `useHealthScore` encapsulate derived data with `useMemo` for performance
- **Frontend-only anomaly detection** — Simple statistical approach (2x category average) that's effective for demo data without ML overhead

## What I'd Add Next

- Real backend API integration with optimistic updates
- Recurring transaction auto-detection
- Budget notifications and email alerts
- Multi-currency support
- Data visualization export (chart screenshots)
- E2E tests with Playwright
