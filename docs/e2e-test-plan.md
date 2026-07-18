# End-to-End Integration Test Plan (SSH-16)

Run after `backend` and `frontend` dev servers are up and `db/schema.sql` is imported.

## Prerequisites

- Backend: `cd backend && npm run dev` (port 5001)
- Frontend: `cd frontend && npm run dev` (port 5173)
- Demo librarian: `librarian@kuet.ac.bd` / `admin123`

## Auth flow

| Step | Action | Expected |
|------|--------|----------|
| 1 | Register student with `@stud.kuet.ac.bd` email | 201 Created, role `student` |
| 2 | Register librarian with `@kuet.ac.bd` email | 201 Created, role `librarian` |
| 3 | Login with same credentials | 200 + `accessToken` |
| 4 | Login with wrong password | 401 Unauthorized |
| 5 | `GET /api/auth/me` with token | 200 + user object |
| 6 | Logout | Refresh cookie cleared; FE returns to login |

## Book catalog (SSH-8)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Librarian adds book via Inventory UI | Book appears in catalog |
| 2 | Student opens Book Catalog | Books load from `GET /api/books` |
| 3 | Search/filter by title/category/availability | Client-side filters work |

## Reservation workflow (SSH-12, SSH-14)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Student clicks **Reserve** on available book | 201, status `pending` |
| 2 | Student opens **My Reservations** | Reservation listed |
| 3 | Student **Cancel** a pending reservation | Status → `cancelled` |
| 4 | Librarian opens **Reservation Panel** | All reservations visible |
| 5 | Librarian **Approve** pending reservation | Status → `issued`, book qty decreases |
| 6 | Librarian **Return** issued reservation | Status → `returned`, qty increases |
| 7 | Librarian **Cancel** pending/issued reservation | Status → `cancelled` |

## Reading room (SSH-15)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Student opens Reading Room | Seat grid loads |
| 2 | Student takes available seat | Seat → `taken` |
| 3 | Student frees own seat | Seat → `available` |
| 4 | Librarian opens **Seating Monitor** | Occupied seats show student name/ID |
| 5 | Librarian frees an occupied seat | Seat → `available` |

## API curl checks

```bash
# Health
curl http://localhost:5001/api/health

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"librarian@kuet.ac.bd","password":"admin123"}'
```
