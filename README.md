# InvoiceFlow — MERN Invoice Generator

A production-ready Invoice Generator built with MongoDB, Express, React (Vite), and Node.js.

---

## Features

- **JWT Authentication** — httpOnly cookie sessions with bcrypt password hashing
- **Item Catalog** — Full CRUD for products/services
- **Invoice Creation** — Live real-time calculations (GST, discount, grand total)
- **Auto Invoice Numbers** — e.g. INV-2026-0001, INV-2026-0002
- **PDF Generation** — Professional PDFs via jsPDF (no html2canvas dependency)
- **Dashboard** — Stats, invoice list with search, status management
- **Admin Seeding** — Auto-creates admin user on first startup

---

## Project Structure

```
invoice-app/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Layout, Toast, StatCard, PageHeader, ProtectedRoute
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Login, Register, Dashboard, Items, CreateInvoice, InvoiceView
│   │   └── utils/           # api.js (axios), format.js, pdfGenerator.js
│   ├── index.html
│   └── vite.config.js
└── server/                  # Node.js + Express backend
    ├── config/db.js
    ├── middleware/auth.js
    ├── models/              # User, Item, Invoice
    ├── routes/              # auth, items, invoices
    └── index.js
```

---

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally (default: `mongodb://localhost:27017`) — or a MongoDB Atlas URI

---

## Setup Instructions

### 1. Clone / extract the project

```bash
cd invoice-app
```

### 2. Configure Backend

```bash
cd server

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/invoice-app
JWT_SECRET=change_this_to_a_long_random_secret
ADMIN_EMAIL=admin@invoiceapp.com
ADMIN_PASSWORD=Admin@123456
CORS_ORIGINS=http://localhost:5173
NODE_ENV=development
```

### 3. Run the Backend

```bash
# From server/ directory
npm run dev       # Development (nodemon)
# OR
npm start         # Production
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected: localhost
✅ Admin user seeded: admin@invoiceapp.com
```

### 4. Configure Frontend

```bash
# From project root
cd client

# Install dependencies
npm install
```

The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically — no extra config needed.

### 5. Run the Frontend

```bash
# From client/ directory
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Default Admin Login

| Field    | Value                   |
|----------|-------------------------|
| Email    | admin@invoiceapp.com    |
| Password | Admin@123456            |

You can change these in `server/.env` before first run.

---

## API Endpoints

### Auth
| Method | Route              | Description         |
|--------|--------------------|---------------------|
| POST   | /api/auth/register | Register new user   |
| POST   | /api/auth/login    | Login               |
| POST   | /api/auth/logout   | Logout              |
| GET    | /api/auth/me       | Get current user    |

### Items (Protected)
| Method | Route           | Description      |
|--------|-----------------|------------------|
| GET    | /api/items      | List all items   |
| POST   | /api/items      | Create item      |
| PUT    | /api/items/:id  | Update item      |
| DELETE | /api/items/:id  | Delete item      |

### Invoices (Protected)
| Method | Route                    | Description           |
|--------|--------------------------|-----------------------|
| GET    | /api/invoices            | List all invoices     |
| GET    | /api/invoices/:id        | Get single invoice    |
| POST   | /api/invoices            | Create invoice        |
| PATCH  | /api/invoices/:id/status | Update status         |
| DELETE | /api/invoices/:id        | Delete invoice        |

---

## Building for Production

### Backend
```bash
# Set NODE_ENV=production in .env
cd server && npm start
```

### Frontend
```bash
cd client
npm run build
# Serve the dist/ folder via nginx or any static host
```

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Axios |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB, Mongoose                   |
| Auth      | JWT, bcryptjs, httpOnly cookies     |
| PDF       | jsPDF                               |
| Icons     | @phosphor-icons/react               |
| Fonts     | Manrope, IBM Plex Mono (Google)     |

---

## License
MIT
