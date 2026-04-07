# Smart Waste Management Dashboard — MERN Stack

A full-stack **MERN** (MongoDB · Express · React · Node.js) real-time smart waste management dashboard.

## 🏗️ Project Structure

```
smart-waste-management/
├── client/               # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── api.ts            # Centralised API service layer
│   │   │   ├── types.ts          # Shared TypeScript interfaces
│   │   │   ├── App.tsx           # Root component
│   │   │   └── components/       # All UI components
│   │   └── styles/
│   ├── vite.config.ts    # Proxies /api → Express on port 3001
│   └── package.json
│
├── server/               # Express + MongoDB backend
│   ├── src/
│   │   ├── index.js      # Express server entry point
│   │   ├── seed.js       # Database seed script
│   │   ├── models/       # Mongoose models (Bin, Worker, Alert, Telemetry, History)
│   │   └── routes/       # REST API routes
│   ├── .env              # MongoDB URI and port config
│   └── package.json
│
├── package.json          # Root — run both with concurrently
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongod`) **or** a MongoDB Atlas connection string

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
Edit `server/.env`:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/smart-waste-db
```

### 3. Seed the Database
```bash
npm run seed
```

### 4. Run Development Servers
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status` | Health check |
| GET | `/api/bins` | List all bins |
| PUT | `/api/bins/:id` | Update a bin |
| GET | `/api/workers` | List all workers |
| POST | `/api/workers/assign` | Assign bins to worker |
| POST | `/api/workers/complete` | Mark collection complete |
| GET | `/api/alerts` | Active alerts |
| PUT | `/api/alerts/:id/resolve` | Resolve alert |
| POST | `/api/telemetry` | Receive ESP32 sensor data |
| GET | `/api/telemetry` | Latest telemetry per bin |
| GET | `/api/history` | Collection history |

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **M**ongoDB | Database + Mongoose ODM |
| **E**xpress | REST API server |
| **R**eact | UI (Vite + TypeScript + Tailwind) |
| **N**ode.js | Runtime |
| Recharts | Analytics charts |
| Sonner | Toast notifications |
| Radix UI | Accessible components |