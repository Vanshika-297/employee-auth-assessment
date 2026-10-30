# Employee Authentication System

A full-stack authentication application built with React, Node.js, Express, and MongoDB. It demonstrates user registration, login, protected pages, and logout.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT), HTTP-only cookies, bcrypt password hashing

## Features

- User registration and login
- Form validation and user-friendly error messages
- Password visibility toggle
- Protected dashboard for authenticated users
- Logout functionality
- Password hashing before storage
- Authentication using JWT stored in HTTP-only cookies
- Responsive interface

> This README describes the intended assessment features. Check your implementation and update this list if any feature differs.

## Project Structure

```text
employee-auth-assessment/
├── client/                 # React frontend
├── server/                 # Express backend
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas database (or a local MongoDB instance)

### 1. Clone the repository

```bash
git clone https://github.com/Vanshika-297/employee-auth-assessment.git
cd employee-auth-assessment
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create `server/.env` using `server/.env.example` as a reference. Set the MongoDB connection string, JWT secret, and any other environment variables expected by the server.

**Never commit `.env` or real credentials to GitHub.**

Start the backend:

```bash
npm run dev
```

The backend is configured to run at `http://localhost:5000` in the development setup.

### 3. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## Authentication API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in an existing user |
| GET | `/api/auth/me` | Get the currently authenticated user |
| POST | `/api/auth/logout` | Log out the current user |

The backend also exposes a health check at `/api/health`.

### How authentication works

1. A user registers with their details.
2. The backend hashes the password before storing it in MongoDB.
3. On successful login, the backend issues a JWT in an HTTP-only cookie.
4. The frontend sends requests with credentials so the browser can include the cookie.
5. Protected routes use the authenticated user's session.
6. Logging out clears the authentication cookie.

## Testing

Automated tests are part of the assessment submission. Run the test scripts defined in `client/package.json` and `server/package.json`.

Before submitting, add the **actual test commands and results** here after running them. Do not report passing tests without verifying them.

## Security Notes

- Passwords are hashed rather than stored as plain text.
- JWTs are stored in HTTP-only cookies.
- Secrets are configured using environment variables.
- Review cookie options, request validation, rate limiting, and CSRF protection against the actual implementation before claiming them as completed.

## Author

**Vanshika Kapoor**

GitHub: [Vanshika-297](https://github.com/Vanshika-297)

## Assessment Submission

This project was developed for a full-stack developer practical assessment.
