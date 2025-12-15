# 🍬 Sweet Shop Management System – Backend

A backend system for managing a sweet shop’s inventory, purchases, and admin operations.  
Built with a production-style architecture using **Node.js, Express, Prisma, and PostgreSQL (Supabase)**, with authentication, role-based access control, and transactional data integrity.

---

## ‣ Features

### Authentication & Authorization
- User registration and login using JWT
- Role-based access control (`USER`, `ADMIN`)
- Secure password hashing with bcrypt
- Admin-only routes protected via middleware

### ‣ API Overview
### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Sweets

- `POST /api/sweets (Admin only)`
- `GET /api/sweets`
- `GET /api/sweets/search`
- `PUT /api/sweets/:id (Admin only)`
- `DELETE /api/sweets/:id (Admin only)`

### Inventory

- `POST /api/sweets/:id/purchase`
- `POST /api/sweets/:id/restock (Admin only)`

### Inventory Management
- Purchase sweets (reduces inventory)
- Restock sweets (Admin only)
- Inventory updates are **atomic and transaction-safe**

### Data Integrity
- All purchases are logged in a `purchases` table
- All restocks are logged in a `restocks` table
- Prisma transactions ensure consistency between inventory updates and logs

### Test Driven Development Approach
- End-to-end API tests using Jest + Supertest
- PostgreSQL-safe database cleanup using `TRUNCATE … CASCADE`
- Deterministic, isolated test runs

---

## 🛠 Tech Stack

- **Node.js**
- **Express**
- **Prisma ORM (v7)**
- **PostgreSQL (Supabase)**
- **JWT Authentication**
- **Jest + Supertest**

---

## ‣ Database Schema (High Level)

- `User`
  - id, name, email, password, role
- `Sweet`
  - id, name, category, price, quantity
- `Purchase`
  - userId, sweetId, quantity, timestamp
- `Restock`
  - adminId, sweetId, quantity, timestamp

> `price` is stored as a `Decimal` and returned as a string to avoid floating-point precision issues.

---

## ‣ Admin Accounts

Admin accounts are **environment-based**.

### How it works
- Admin emails are defined using an environment variable
- If a user registers with an email present in this list, they are automatically assigned the `ADMIN` role

### Example
```env
ADMIN_EMAILS=admin@example.com,owner@example.com
```

## ‣ Getting Started

Follow the steps below to run the backend locally.

---

### ‣ Clone the Repository

```bash
git clone https://github.com/VarunGotmare/sweet-mgmt-backend.git
cd sweet-shop-backend
```

### ‣ Install Dependencies

```bash
npm install
```

### ‣ Environment Variables

```bash
DATABASE_URL=your_supabase_postgres_connection_url
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAILS=admin@example.com,owner@example.com
```

### ‣ Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### ‣ Start the Server

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

- Each test runs against a clean database state
- PostgreSQL tables are truncated before each test using TRUNCATE … CASCADE
- No test data persists after the test run completes
