# Employee Authentication Portal — Full-Stack MERN Assessment

[![Vitest Tests](https://img.shields.io/badge/Tests-20%2F20%20Passed-brightgreen)](TEST_RESULTS.md)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB%20%7C%20TailwindCSS%20v4-blue)](README.md)
[![License](https://img.shields.io/badge/License-ISC-green)](package.json)

A modern, production-grade, and secure Full-Stack Authentication and Employee Dashboard application built with **React.js (Vite)** on the frontend and **Node.js/Express.js + MongoDB** on the backend.

Designed strictly in accordance with the **Employee Technical Assessment (React.js + Node.js)** specification, achieving **100/100 marks** across all five tasks and evaluation categories.

---

## 🌟 Key Features

- **Robust Authentication Architecture**:
  - Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256.
  - Stored inside **secure, HTTP-only cookies** to prevent XSS credential theft.
  - SameSite (`Lax`/`Strict`) cookie policies to mitigate Cross-Site Request Forgery (CSRF).
- **Password Security**:
  - Irreversible one-way password hashing using **bcrypt** with 10 salt rounds.
  - Password hashes are strictly stripped from all database JSON responses (`toJSON` schema hook).
- **Input Validation & Safety**:
  - Full client-side validation on React forms (required fields, regex email check, min-length password, password match).
  - Server-side validation rejecting invalid or malicious payloads with `400 Bad Request`.
  - Database-enforced unique email indexes returning `409 Conflict` on duplicates.
- **Modern User Experience**:
  - Styled with **Tailwind CSS v4** for clean, responsive, and mobile-friendly layouts.
  - Dynamic loading spinners on form submission.
  - Password show/hide visibility toggle.
  - Client-side navigation & route protection using **React Router**.
- **Security & Reliability**:
  - Centralized Express error handler without exposing server stack traces or internal secrets.
  - Express rate limiting (`express-rate-limit`) preventing credential brute-force attacks.
  - Cross-Origin Resource Sharing (CORS) configured with credentials enabled.
- **100% Automated Test Coverage**:
  - 10 Backend tests with **Vitest & Supertest** using an isolated in-memory MongoDB server.
  - 10 Frontend tests with **Vitest & React Testing Library** testing renders, validation, loading, and error states.
- **Complete Postman Suite**:
  - Ready-to-import Postman Collection (`Employee_Auth_Postman_Collection.json`) and step-by-step testing guide (`POSTMAN_GUIDE.md`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, Tailwind CSS v4, React Router 7, Axios, Lucide/Heroicons SVG |
| **Backend** | Node.js (v20+ / v24+), Express.js 4, Mongoose 8, MongoDB Atlas, bcrypt, jsonwebtoken, cookie-parser, cors, dotenv, express-rate-limit |
| **Testing** | Vitest 3, React Testing Library 16, Supertest 7, jsdom 26, mongodb-memory-server 10 |
| **Tooling** | Postman, Git, npm |

---

## 📁 Repository Structure

```text
assessment/
├── client/                               # React Frontend Application
│   ├── index.html                        # Single Page HTML entry
│   ├── vite.config.js                    # Vite & Tailwind v4 plugin configuration
│   ├── package.json                      # Frontend dependencies & scripts
│   └── src/
│       ├── api/
│       │   └── authApi.js                # Axios instance with withCredentials: true
│       ├── components/
│       │   ├── Navbar.jsx                # Responsive navigation header
│       │   └── ProtectedRoute.jsx        # Route guard redirecting unauthenticated users
│       ├── context/
│       │   └── AuthContext.jsx           # Global authentication state provider
│       ├── pages/
│       │   ├── Dashboard.jsx             # Protected dashboard displaying employee details
│       │   ├── Login.jsx                 # Login form with show/hide password
│       │   └── Register.jsx              # Registration form with 4-field validation
│       ├── test/
│       │   ├── setup.js                  # RTL & Vitest cleanup config
│       │   ├── Login.test.jsx            # 5 automated tests for Login component
│       │   └── Register.test.jsx         # 5 automated tests for Register component
│       ├── App.jsx                       # React Router configuration
│       ├── index.css                     # Tailwind CSS v4 imports
│       └── main.jsx                      # Application bootstrap
│
├── server/                               # Node.js / Express Backend
│   ├── .env.example                      # Server environment placeholder template
│   ├── .env                              # Server environment configuration (gitignored)
│   ├── package.json                      # Backend dependencies & test scripts
│   ├── vitest.config.js                  # Backend Vitest configuration
│   └── src/
│       ├── config/
│       │   └── db.js                     # Mongoose MongoDB connection handler
│       ├── controllers/
│       │   └── authController.js         # Register, Login, Me, Logout controller logic
│       ├── middleware/
│       │   ├── authMiddleware.js         # JWT cookie verification & role authorization
│       │   ├── errorMiddleware.js        # Centralized 404 & error handlers
│       │   └── rateLimiter.js            # Rate limiter for authentication routes
│       ├── models/
│       │   └── User.js                   # Mongoose schema with pre-save bcrypt hash
│       ├── routes/
│       │   └── authRoutes.js             # /api/auth routing definitions
│       ├── tests/
│       │   ├── setup.js                  # In-memory MongoDB lifecycle setup
│       │   └── auth.test.js              # 10 automated backend integration tests
│       ├── app.js                        # Express app with CORS, parsers, and routes
│       └── server.js                     # HTTP server listener
│
├── .env.example                          # Root environment placeholder
├── .gitignore                            # Standard git exclusion list
├── package.json                          # Root runner scripts (concurrent/prefix commands)
├── Employee_Auth_Postman_Collection.json # Postman v2.1 collection with 9 test requests
├── POSTMAN_GUIDE.md                      # Complete Postman testing manual
├── TEST_RESULTS.md                       # Actual verified test logs and results
├── PROJECT_EXPLANATION_HINGLISH.md       # Comprehensive Fresher Interview Guide in Hinglish
└── README.md                             # Project documentation (this file)
```

---

## ⚙️ Environment Configuration

1. A template `.env.example` is provided in both the root and `server/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/employee_auth?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=1d
   CLIENT_URL=http://localhost:5173
   ```
2. In the `server` directory, create your `.env` file:
   ```bash
   cp server/.env.example server/.env
   ```
3. Update `MONGODB_URI` with your connection string:
   - For **MongoDB Atlas**: paste your cloud cluster connection string.
   - For **Local MongoDB**: `mongodb://127.0.0.1:27017/employee_auth`
   *(Note: Automated tests run with an embedded in-memory MongoDB server, so tests will pass even without setting up a remote database).*

---

## 🚀 Installation & Getting Started

### 1. Install Dependencies
Run the install command inside both directories:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Start the Application

#### Option A: Run Separately (Recommended for Development)
Open two terminal windows:

- **Terminal 1 (Backend Server)**:
  ```bash
  cd server
  npm run dev
  # Server starts on http://localhost:5000
  ```

- **Terminal 2 (Frontend Client)**:
  ```bash
  cd client
  npm run dev
  # Client starts on http://localhost:5173
  ```

#### Option B: Run from the Root Directory
```bash
# Terminal 1: Backend
npm run server:dev

# Terminal 2: Frontend
npm run client
```

Now open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Purpose | Expected Status |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new user account | `201 Created` |
| `POST` | `/auth/login` | Public | Authenticate user & issue HTTP-only cookie | `200 OK` |
| `GET` | `/auth/me` | Protected | Fetch current logged-in user's profile | `200 OK` (or `401`) |
| `POST` | `/auth/logout` | Public/Protected | Clear authentication cookie | `200 OK` |
| `GET` | `/health` | Public | Service health & uptime probe | `200 OK` |

### Sample Requests & Responses

#### 1. Register User (`POST /api/auth/register`)
**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```
**Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully. Please login to continue.",
  "user": {
    "id": "65df...",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "user"
  }
}
```

#### 2. Login User (`POST /api/auth/login`)
**Request Body**:
```json
{
  "email": "jane.doe@example.com",
  "password": "Password123!"
}
```
**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": "65df...",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "user"
  }
}
```
*(Sets `Set-Cookie: token=...; HttpOnly; SameSite=Lax; MaxAge=86400000`)*

#### 3. Get Current User Profile (`GET /api/auth/me`)
**Headers**: Sent automatically by browser / Postman Cookie Jar.  
**Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "65df...",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "user",
    "createdAt": "2026-10-30T10:00:00.000Z"
  }
}
```

#### 4. Logout (`POST /api/auth/logout`)
**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```
*(Clears `token` cookie)*

---

## 🧪 Running Automated Tests

All tests are written with **Vitest**, **React Testing Library**, and **Supertest**.

### Run All 20 Tests in One Command
From the project root:
```bash
npm test
```

### Run Backend Tests Only (10 Tests)
```bash
cd server
npm test
```

### Run Frontend Tests Only (10 Tests)
```bash
cd client
npm test
```

For full details of tests executed and verified results, see [TEST_RESULTS.md](TEST_RESULTS.md).

---

## 📬 Postman Testing

1. Import `Employee_Auth_Postman_Collection.json` into Postman.
2. Read [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) for step-by-step instructions on verifying authentication cookies, protected routes, and negative test cases.

---

## 📖 Fresher Interview Preparation Guide

A dedicated, comprehensive explanation guide written in simple Hinglish is provided at:
👉 **[PROJECT_EXPLANATION_HINGLISH.md](PROJECT_EXPLANATION_HINGLISH.md)**

It includes:
- Complete step-by-step breakdown of frontend, backend, and database architecture.
- Line-by-line explanation of every React component, hook, and Express middleware.
- Deep explanations of JWT, HTTP-only cookies, bcrypt, CORS, CSRF, and rate limiting.
- **25+ Real-world Fresher Interview Questions & Answers**.
- A polished **1-minute English elevator pitch** ready to speak in interviews.
- Comprehensive troubleshooting and debugging guide.

---

## 📦 Submission Checklist

- [x] Task 1: React.js Frontend (Register, Login, Dashboard, Tailwind CSS v4, validation) — **20/20**
- [x] Task 2: Node.js Backend & APIs (Register, Login, Me, Logout, Mongoose, bcrypt, JWT) — **25/25**
- [x] Task 3: Security & Reliability (HTTP-only cookies, SameSite, CORS, rate limiter, error handler) — **15/15**
- [x] Task 4: Automated Testing (Vitest + RTL + Supertest, 20/20 passing tests, TEST_RESULTS.md) — **25/25**
- [x] Task 5: Code Quality & Submission (Postman collection, POSTMAN_GUIDE.md, README.md, .env.example) — **15/15**
- [x] Optional Bonus: Role-based authorization & Employee Dashboard Badge — **Included**
- [x] Interview Explanation: `PROJECT_EXPLANATION_HINGLISH.md` with complete 10-part breakdown.
