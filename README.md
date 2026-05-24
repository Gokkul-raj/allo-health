# Inventory Reservation System

## Deployment

### Live Application

```text
https://allo-health-eight-nu.vercel.app/
```

A full-stack inventory reservation system built using **Next.js, Prisma, PostgreSQL (Supabase), and Tailwind CSS**.

This application allows users to reserve inventory items from warehouses, confirm or cancel reservations, and automatically releases expired reservations.

## Features

- View available products and stock by warehouse
- Reserve products
- Reservation checkout page with countdown timer
- Confirm reservation
- Cancel reservation
- Automatic reservation expiry handling
- Concurrency-safe inventory updates using database transactions
- PostgreSQL database with Prisma ORM
- Fully deployed on Vercel

---

## Tech Stack

### Frontend
- Next.js 16
- React
- Tailwind CSS
- Axios

### Backend
- Next.js API Routes
- Prisma ORM

### Database
- PostgreSQL (Supabase)

### Deployment
- Vercel

---

## Project Structure

```text
app/
├── api/
│   ├── products/
│   ├── warehouses/
│   └── reservations/
│       ├── [id]/
│       │   ├── confirm/
│       │   └── release/
│
├── reservation/
│   └── [id]/
│
lib/
├── prisma.ts

prisma/
├── schema.prisma
├── seed.ts
```

---

## API Endpoints

### Products

#### Get all products

```http
GET /api/products
```

Returns products with warehouse stock availability.

---

### Warehouses

#### Get all warehouses

```http
GET /api/warehouses
```

Returns available warehouses.

---

### Reservations

#### Create reservation

```http
POST /api/reservations
```

Request body:

```json
{
  "productId": "product-id",
  "warehouseId": "warehouse-id",
  "quantity": 1
}
```

---

#### Get reservation details

```http
GET /api/reservations/:id
```

Returns reservation details.

---

#### Confirm reservation

```http
POST /api/reservations/:id/confirm
```

Confirms reservation if not expired.

---

#### Cancel reservation

```http
POST /api/reservations/:id/release
```

Releases reserved inventory.

---

# How to Run the App Locally

## 1. Clone Repository

```bash
git clone <your-github-repository-url>
```

Move into project folder:

```bash
cd allo-health
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the root directory.

Add:

```env
DATABASE_URL=your_supabase_pooling_url

DIRECT_URL=your_supabase_direct_url
```

Example:

```env
DATABASE_URL=postgresql://username:password@host:5432/postgres?pgbouncer=true

DIRECT_URL=postgresql://username:password@host:5432/postgres
```

---

## 4. Push Database Schema

Run:

```bash
npx prisma db push
```

This will sync Prisma schema with PostgreSQL.

---

## 5. Seed Database

Run:

```bash
npx tsx prisma/seed.ts
```

This adds sample:

- Products
- Warehouses
- Inventory

---

## 6. Run the Application

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Reservation Expiry Mechanism (Production)

Reservations expire automatically after **10 minutes**.

### How it works

When a reservation is created:

- Status becomes `PENDING`
- Inventory is reserved
- `expiresAt` timestamp is generated

The system uses a **lazy cleanup mechanism**:

Whenever products are fetched (`GET /api/products`):

1. Expired `PENDING` reservations are identified
2. Reserved stock is automatically restored
3. Reservation status becomes `RELEASED`

This approach avoids running background workers or cron jobs while still ensuring expired inventory becomes available again.

---

# Concurrency Handling

The reservation system uses:

```text
Prisma Transaction + Serializable Isolation Level
```

This prevents race conditions when multiple users try to reserve the last available inventory at the same time.

---

# Trade-offs / Improvements

## Trade-offs Made

### 1. Lazy Expiry Cleanup

Instead of implementing cron jobs or background workers, a lazy cleanup mechanism was used for simplicity and faster implementation.

**Reason:**  
This was easier to implement while still satisfying expiry requirements.

---

### 2. Basic UI

The frontend focuses on functionality rather than advanced UI/UX design.

**Reason:**  
Priority was given to reservation logic and backend correctness.

---

## Improvements With More Time

If given more time, the following improvements would be added:

- Scheduled background jobs for reservation expiry
- Authentication and user accounts
- Better UI/UX design
- Admin dashboard for inventory management
- Reservation history
- Unit and integration testing
- Real-time stock updates using WebSockets

---

## Author

Built as part of the **Allo Health Inventory Reservation Assignment**.
