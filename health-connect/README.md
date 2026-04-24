# Health Connect — ROBOTECH V0

> Maternal care appointment booking platform with OTP login, booking lifecycle management, and a full admin approval flow.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [V0 Flow](#v0-flow)
- [Screens](#screens)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)

---

## Overview

Health Connect is a web-based maternal healthcare coordination platform built for the ROBOTECH V0 phase. It allows patients to request care appointments via phone OTP login, track booking status in real-time, and perform reschedule or cancellation actions. Admins receive all requests in a dedicated dashboard where they can assign slots, suggest reschedules, or reject bookings with reasons.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 15 (App Router) + TypeScript |
| Styling   | Vanilla CSS (custom design system)  |
| Backend   | Express.js + TypeScript             |
| Auth      | OTP via phone (demo: `1234`)        |
| State     | In-memory store (demo-ready)        |

---

## V0 Flow

The complete end-to-end flow for Phase 1:

```
1. Patient visits /login
        │
        ▼
2. Enters 10-digit mobile number → clicks "Send code"
        │
        ▼
3. OTP verification screen (demo OTP: 1234) → clicks "Verify & continue"
        │
        ▼
4. Redirected to /requester/dashboard
        │  (shows all bookings with Pending / Approved / Rejected / Rescheduled / Cancelled status)
        │
        ▼
5. Clicks "Request slot" → /requester/book
        │  - Fills Patient Details (Name, Age, Gender, City)
        │  - Selects Service Type (Antenatal, Postnatal, etc.)
        │  - Optionally enters Doctor Preference
        │  - Picks a time slot from the 7-day slot grid
        │  - Clicks "Submit Booking Request"
        │
        ▼
6. Booking created with status: PENDING
        │  Patient can now:
        │    • Cancel booking (with reason)
        │    • Accept rescheduled slot (if admin suggests one)
        │
        ▼
7. Admin logs in at /admin (password: admin123)
        │
        ▼
8. Admin sees /admin/dashboard with real-time booking list
        │  (filter by: All / Pending / Confirmed / Rejected / Rescheduled / Cancelled)
        │
        ▼
9. Admin opens a booking → /admin/booking/[id]
        │  Admin can:
        │    • ✅ Approve & Assign Slot  → status becomes CONFIRMED
        │    • 🔁 Suggest Another Slot  → status becomes RESCHEDULED (patient must accept)
        │    • ❌ Reject (with reason)   → status becomes REJECTED
        │
        ▼
10. Patient dashboard auto-refreshes every 5 seconds to reflect status changes
```

---

## Screens

| # | Screen | Route | Description |
|---|--------|--------|-------------|
| 1 | **Login — Phone Entry** | `/login` | Patient enters mobile number to receive OTP |
| 2 | **Login — OTP Verify** | `/login` | 4-digit OTP input with back navigation |
| 3 | **Patient Dashboard** | `/requester/dashboard` | Lists all bookings with status badges; link to book |
| 4 | **Book Appointment** | `/requester/book` | Multi-step form: patient info, service type, slot picker |
| 5 | **Booking Detail (Patient)** | `/requester/booking/[id]` | Full detail view with Cancel / Accept Reschedule actions |
| 6 | **Admin Login** | `/admin` | Admin password gate |
| 7 | **Admin Dashboard** | `/admin/dashboard` | All requests with filter tabs and stat cards |
| 8 | **Booking Detail (Admin)** | `/admin/booking/[id]` | Full patient info + Approve / Reschedule / Reject actions |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Start the Backend API

```bash
cd health-connect-api
npm install
npm run dev
# API runs on http://localhost:4000
```

### 2. Start the Frontend

```bash
cd health-connect
npm install
npm run dev
# App runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

| Role    | How to Login                                                    |
|---------|-----------------------------------------------------------------|
| Patient | Any 10-digit mobile number → OTP: **1234**                      |
| Admin   | Go to `/admin` → Password: **admin123**                         |

---

## Project Structure

```
health-connect/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Landing / Home
│   │   ├── login/
│   │   │   └── page.tsx                      # OTP Login (phone + verify)
│   │   ├── requester/
│   │   │   ├── dashboard/page.tsx            # Patient booking dashboard
│   │   │   ├── book/page.tsx                 # New booking form
│   │   │   └── booking/[id]/page.tsx         # Booking detail + Cancel/Accept
│   │   └── admin/
│   │       ├── page.tsx                      # Admin login
│   │       ├── dashboard/page.tsx            # All bookings + filters
│   │       └── booking/[id]/page.tsx         # Admin action page
│   ├── components/
│   │   ├── Header.tsx                        # Shared nav header
│   │   ├── SlotPicker.tsx                    # 7-day interactive slot grid
│   │   ├── StatusBadge.tsx                   # Colour-coded status pill
│   │   └── Toast.tsx                         # Notification toast
│   └── lib/
│       ├── api.ts                            # API base URL config
│       └── types.ts                          # Shared TypeScript types

health-connect-api/
├── src/
│   ├── index.ts                              # Express app entry
│   ├── store.ts                              # In-memory data store
│   ├── types.ts                              # Booking & User types
│   └── routes/
│       ├── auth.ts                           # POST /api/auth/send-otp, verify-otp
│       ├── bookings.ts                       # CRUD + PATCH for bookings
│       ├── slots.ts                          # GET /api/slots
│       └── admin.ts                          # Admin auth route
```

---

## API Reference

### Auth

| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| POST   | `/api/auth/send-otp`      | Send OTP to phone (demo: logs it)  |
| POST   | `/api/auth/verify-otp`    | Verify OTP → returns user session  |

### Bookings

| Method | Endpoint              | Description                                         |
|--------|-----------------------|-----------------------------------------------------|
| GET    | `/api/bookings`       | Get all bookings (admin) or by `?userId=` (patient) |
| POST   | `/api/bookings`       | Create a new booking request                        |
| GET    | `/api/bookings/:id`   | Get single booking detail                           |
| PATCH  | `/api/bookings/:id`   | Update status (Confirmed / Rejected / Rescheduled / Cancelled) |

### Slots

| Method | Endpoint      | Description                                |
|--------|---------------|--------------------------------------------|
| GET    | `/api/slots`  | Returns available 30-min slots for 7 days  |

---

## Booking Status Lifecycle

```
PENDING ──► CONFIRMED  (Admin approves + assigns slot)
        ──► RESCHEDULED (Admin suggests new slot → patient must accept)
        ──► REJECTED   (Admin rejects with reason)
        ──► CANCELLED  (Patient cancels with reason)

CONFIRMED ──► CANCELLED  (Patient cancels)
RESCHEDULED ──► CONFIRMED (Patient accepts new slot)
            ──► CANCELLED (Patient cancels)
```

---

## Phase 1 Completion Status

| Feature                              | Status |
|--------------------------------------|--------|
| Patient OTP Login (phone + verify)   | ✅ Done |
| Booking request form                 | ✅ Done |
| Slot picker (7-day grid)             | ✅ Done |
| Pending / Approved / Rejected status | ✅ Done |
| Reschedule flow (admin → patient)    | ✅ Done |
| Cancel option (patient)              | ✅ Done |
| Admin dashboard with filters         | ✅ Done |
| Admin slot assignment + approval     | ✅ Done |
| Real-time status polling             | ✅ Done |
| README — V0 flow documented          | ✅ Done |
