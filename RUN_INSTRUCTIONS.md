# HealthTech: Demo & Run Instructions

## Prerequisites
- **Node.js**: Version 20 or higher is required (configured for `^20` and `^20.11.30`).

---

## 1. Backend API (`health-connect-api`)

### Installation
Navigate to the backend directory and install the necessary dependencies:
```bash
cd health-connect-api
npm install
```

### Environment Variables (`.env`)
Create a `.env` file in the `health-connect-api` directory. Use these sample values (no secrets needed for local execution):

```env
# Backend — Health Connect API (Express / Vercel Serverless)
# Port used only for local dev (Vercel ignores this)
PORT=4000
```

### Running Locally
Start the development server (which uses `nodemon` and `ts-node` for live reloading):
```bash
npm run dev
```
The backend will now be running at `http://localhost:4000`.

---

## 2. Frontend Web App (`health-connect`)

### Installation
Open a new terminal, navigate to the frontend folder, and install its dependencies:
```bash
cd health-connect
npm install
```

### Environment Variables (`.env.local`)
Create a `.env.local` (or `.env`) file in the `health-connect` directory. Set the API URL to point to your local backend during development:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```
*(Note: In the provided `.env.example`, it illustrates typical Vercel deployment: `NEXT_PUBLIC_API_URL=https://your-backend.vercel.app`. Be sure it's set to your local `http://localhost:4000` when testing locally).*

### Running Locally
Start the Next.js development server:
```bash
npm run dev
```
The frontend UI will be accessible at `http://localhost:3000`.

---

## Quick Start Summary

To get both servers running simultaneously for a demo, open two separate terminal instances:

**Terminal 1 (Backend)**
```bash
cd health-connect-api
npm install
npm run dev
```

**Terminal 2 (Frontend)**
```bash
cd health-connect
npm install
npm run dev
```
