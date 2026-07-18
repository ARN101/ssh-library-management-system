# Shaheed Smriti Hall (SSH) Library Management System

Full-stack library and reading-room app for the KUET ISD Lab course project.

Students browse books, place reservations, and book reading-room seats. Librarians manage inventory, approve issues/returns, and monitor seating.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Ant Design, Redux Toolkit / RTK Query |
| Backend | Node.js, Express, JWT, bcrypt |
| Database | MySQL 8 (`mysql2` connection pool) |

## Features

- KUET-domain registration and login (`@stud.kuet.ac.bd` → student, `@kuet.ac.bd` → librarian)
- Student book catalog with search, category, and availability filters
- Book reservation lifecycle: pending → issued → returned / cancelled
- Student cancel for pending reservations
- Librarian inventory CRUD and reservation approval panel
- Reading room seat grid (30 seats) with live polling
- Librarian seating monitor with occupant details

## Quick start (local)

### 1. Database

```bash
mysql -u root -p < db/schema.sql
```

Demo librarian (seeded):

- Email: `librarian@kuet.ac.bd`
- Password: `admin123`

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit DB_* and JWT secrets
npm install
npm run dev            # http://localhost:5001
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_BASE_URL=http://localhost:5001/api
npm install
npm run dev            # http://localhost:5173
```

### 4. Seed books + covers (optional)

Loads **100+** books across academic domains, then downloads cover images into `frontend/public/covers`:

```bash
cd backend
npm run seed-books
npm run download-covers
```

Covers are stored locally (`/covers/{isbn}.jpg`) so the catalog always shows book covers offline.

### 5. Smoke test

```bash
cd backend
npm run smoke-test
# or: node scripts/smoke-test.js http://localhost:5001
```

## API overview

| Mount | Purpose |
|-------|---------|
| `POST /api/auth/register` | Register (role from email domain) |
| `POST /api/auth/login` | Login → access token + refresh cookie |
| `POST /api/auth/refresh-token` | Silent refresh |
| `POST /api/auth/logout` | Clear refresh cookie |
| `GET /api/auth/me` | Current user |
| `/api/books` | Catalog + librarian CRUD |
| `/api/reservations` | Create, list, status updates |
| `/api/seats` | Reading room seats |

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for Netlify + Render hosting, and [`docs/e2e-test-plan.md`](docs/e2e-test-plan.md) for manual E2E checks.

## Roles & routes

| Role | Home routes |
|------|-------------|
| Student | `/student/book-catalog`, `/student/my-reservations`, `/student/reading-room` |
| Librarian | `/admin/book-inventory`, `/admin/reservations`, `/admin/seating-monitor` |

## Team

- Ashrafur Rahman Nihad — Scrum Master
- Safi — Frontend
- Sajin — Backend

Course: Information System Design Lab, CSE, KUET.
