# 🍬 Sweet Shop Management System – Frontend

A role-aware **React single-page application** for managing a sweet shop’s inventory and purchases.  
Built with **React + Vite + Tailwind CSS**, integrated with a JWT-based backend.

---

## ‣ Features

- JWT Authentication (Login & Register)
- Role-based access (`USER`, `ADMIN`)
- Protected & public routes
- Single-page dashboard UX
- Sweets displayed in a **row-based list**
- Purchase action (stock-aware)
- Admin-only dashboard
- Automatic logout on unauthorized access

---

## ‣ Tech Stack

- React (Hooks)
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router v6

---

## ‣ Folder Structure

```txt
src/
├── api/
│   ├── axios.ts          # Axios instance with interceptors
│   ├── auth.api.ts       # Auth API calls
│   └── sweets.api.ts     # Sweets & inventory API calls
│
├── auth/
│   ├── AuthContext.tsx   # Auth state management
│   ├── useAuth.ts
│   ├── ProtectedRoute.tsx
│   ├── AdminRoute.tsx
│   └── PublicRoute.tsx
│
├── components/
│   └── SweetList.tsx     # Row-based sweets list UI
│
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Home.tsx
│   └── Admin.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

## ‣ Authentication Flow

  1. User logs in / registers
  
  2. Backend returns JWT + user info
  
  3. Token stored in localStorage
  
  4. JWT attached to all API requests
  
  5. UI rendered based on user role

## ‣ Environment Variables

```env
VITE_API_URL=https://<backend-hosted-url>
```

## ‣ Development

```
npm install
npm run dev
```

## ‣ Build

```
npm run build
```
