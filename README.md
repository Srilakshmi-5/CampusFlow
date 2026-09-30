# CampusFlow – Campus Resource & Queue Intelligence Platform

> **“Know Before You Go.”**
> CampusFlow is a unified campus intelligence platform that prevents bottlenecks and queue congestion across campus facilities (Canteen, Library, Admin Services, Fees Counter) through real-time visibility, predictive forecasting, and automated load balancing.

---

## 🌟 Key Modules & Features

### 1. 🍽️ Canteen Module (Flagship)
- **Multi-Facility Selection**: Real-time switching between Central Dining Commons and South Campus Food Hub.
- **Live Occupancy & Crowd Sensors**: Live seating density meter (% occupied, available seats), queue flow speed, and counter wait times.
- **Hero Feature: “Can I Make It To Class?”**:
  - Student inputs their next class time.
  - The Campus Intelligence Engine calculates: `Prep Time + Pickup Queue Wait + Dining Pace + Campus Walk Time`.
  - Displays instant verdict: **`SAFE`** (green), **`TIGHT`** (amber), or **`NOT SAFE`** (red).
  - Offers 1-click recommendations (e.g. filter quick meals under 6 minutes prep or select express takeaway).
- **Intelligent Pre-Ordering & Slot Load Balancing**: Distributes orders across 10-minute pickup windows capped at 40–45 orders to eliminate counter surges.
- **Real-Time Order Tracking**: 4-stage live stepper (`Placed` → `Preparing` → `Ready` → `Picked Up`) with dynamic scannable QR tokens and assigned counter numbers.
- **Kitchen Display System (KDS)**:
  - Real-time order pipeline for kitchen staff.
  - 1-click status bumps (`Start Preparing` → `Mark Ready for Pickup` → `Mark Picked Up`).
  - Batch preparation demand aggregator (e.g. "Prep 14x Veg Burger, 8x Cold Brew").

---

### 2. 📚 Library Module
- **Live Seat Occupancy**: Global library capacity gauge and zone breakdown:
  - **Zone A**: Silent Deep Work Sanctuary (acoustic study pods).
  - **Zone B**: Collaborative & Discussion Hub.
  - **Zone C**: Digital Media & Reading Lounge.
- **Next Available Seat Turnover ETA**: Poisson-inspired turnover estimator when facilities approach full capacity.
- **Interactive Seat Map**: Grid layout showing dedicated 230V power sockets and occupied vs. free pods.
- **Time-Slot Seat Reservations**: 2-hour reserved focus passes with check-in grace period rules.
- **Exam Surge Prediction Engine**: Analyzes scheduled university exams to project crowd multipliers and warn students 2–6 days before peak capacity.
- **Librarian Control Desk**: 1-click seat occupancy toggles, zone capacity overrides, and reservation releases.

---

### 3. 📑 Admin Services Module
- **Service Catalog**: Bonafide Certificates, Transfer Certificates (TC), Application Form Attestations, and Student Grievances.
- **Automated Document Pre-Check**: Rule-based validator that checks file attachments, formats, and mandatory documents before issuing tokens, preventing counter turn-aways.
- **Digital Token Queue Tracker**: Live queue countdown showing your token, currently served token at counter, and real-time wait time.
- **Staff Registry Console**: Multi-counter dispatcher (`Counter 1`, `Counter 2`) with "Call Next Token", document inspection, and application completion.

---

### 4. 💳 Fees Counter Module
- **Semester Breakdown**: Detailed fee components (Tuition, Lab, Exam, Library dues) and due date alerts.
- **Digital Payment Simulator**: 1-click checkout (UPI, Debit Card, NetBanking) with instant status clearance.
- **Official Digital Fee Receipt**: Authenticated digital receipt with transaction reference ID, university stamp, line items, and print/PDF view.
- **Physical Counter Digital Token**: Get in-person tickets (e.g. `F-201`) with live wait estimates before walking to the physical Finance Office.
- **Fees Staff Console**: Counter queue manager to call and clear in-person tickets.

---

### 5. ⚡ Super Admin & Campus Intelligence Dashboard
- **Campus Congestion Index (0–100%)**: Master AI-weighted congestion index aggregating dining rush, library density, and counter queues.
- **Demand Prediction Curves (Recharts)**: Hourly occupancy forecast with historical peak multipliers (lunch rush 1.85x, exam month 1.35x).
- **Live Simulation Playground**:
  - 1-click triggers to inject simulated **Lunch Rush** and **Exam Season Surge**.
  - Interactive sliders to manually adjust seat occupancy across all facilities and observe the platform respond in real-time.
  - Menu item availability toggles (instant out-of-stock simulation).

---

## 👥 Demo Accounts & Role Switcher

CampusFlow includes a **Sticky 1-Click Role Switcher** at the top of the application to test all 6 user roles seamlessly without logging in and out:

| Role | Demo Persona | Email | Purpose |
| :--- | :--- | :--- | :--- |
| **Student** | Aarav Sharma | `student@campusflow.edu` | Pre-orders, class time calculator, seat reservations, tokens, fee settlement |
| **Kitchen Staff** | Chef Vikram Singh | `kitchen@campusflow.edu` | Kitchen Display System (KDS), bumping order pipeline, batch prep counts |
| **Librarian** | Dr. Meenakshi Sundaram | `librarian@campusflow.edu` | Manual seat floor overrides, zone crowd overrides, reservation management |
| **Admin Staff** | Officer Rajesh Varma | `adminstaff@campusflow.edu` | Document pre-check verification, calling next token at service counters |
| **Fees Staff** | Accounts Desk Sunita | `fees@campusflow.edu` | Counter ticket dispatcher, cash challan reconciliations |
| **Super Admin** | Prof. K. Venkatesh (Provost) | `superadmin@campusflow.edu` | Master campus congestion index, demand charts, simulation sliders |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui design patterns
- **State Management**: Zustand (client UI state & reactive simulation store) + TanStack React Query (data caching)
- **Forms & Validation**: React Hook Form + Zod
- **Data Visualizations**: Recharts (hourly demand forecast curves)
- **Notifications**: Sonner (toasts) + Real-time notifications popover
- **Database & Auth**: Supabase (PostgreSQL, RLS policies, Auth schema) + built-in zero-setup demo mode

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Setup (Optional)
If you wish to connect a live Supabase project, copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
> **Note**: Even without Supabase keys, CampusFlow runs 100% out-of-the-box in reactive demo mode with full state persistence and simulation features!

### 3. Database Schema Setup (for Supabase users)
Execute the provided SQL migration files in your Supabase SQL Editor:
1. `supabase/schema.sql`: Creates all tables, relationships, and Row Level Security (RLS) policies.
2. `supabase/seed.sql`: Populates realistic campus data, food courts, menu items, pickup slots, library zones, and exam schedules.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```
