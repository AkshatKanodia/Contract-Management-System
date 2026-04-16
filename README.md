# Full Stack Contract Management Dashboard

A complete, production-ready Full Stack Contract Management Dashboard. Built with React (Vite) + Redux Toolkit on the frontend and Node.js + Express + MongoDB on the backend.

## Features Built
- Full Authentication (JWT & bcrypt).
- Contract CRUD with MongoDB.
- History/Audits versions using Snapshots for full rollback traces.
- Premium UI built from scratch with custom CSS (no Tailwind).
- Search, Filtration, Pagination, and Data Visualization.

## How to Run

1. Make sure you have **Node.js** installed and **MongoDB** running locally on its default port (`27017`).
2. Clone or open the repository.
3. In the root `contract-management` directory, run:
```bash
npm install
npm run install-all
```
4. Start both the Backend and Frontend concurrently using:
```bash
npm run start
```

Your React app will automatically open at `http://localhost:5173` and the backend will start gracefully at `http://localhost:5000`.
