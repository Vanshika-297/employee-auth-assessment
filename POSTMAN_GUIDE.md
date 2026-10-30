# Postman API Testing Guide

This guide walks you through testing the Employee Authentication REST APIs using Postman.

---

## 1. Prerequisites & Starting the Backend

1. Open your terminal in the `server` directory:
   ```bash
   cd server
   ```
2. Ensure your `.env` file exists with the following configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/employee_auth?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_employee_practical_assessment_2026
   JWT_EXPIRES_IN=1d
   CLIENT_URL=http://localhost:5173
   ```
3. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
4. Verify the server is running by opening:
   `http://localhost:5000/api/health`
   You should see:
   ```json
   {
     "status": "ok",
     "message": "Employee Auth Service is up and running"
   }
   ```

---

## 2. Importing the Postman Collection

1. Open the **Postman** desktop application (or web client).
2. Click the **Import** button in the top-left corner.
3. Drag and drop or browse to select:
   `Employee_Auth_Postman_Collection.json` from the root of this repository.
4. Click **Import**.
5. You will see a collection named **Employee Authentication API - Practical Assessment** with two folders:
   - `1. Authentication - Success Flow`
   - `2. Validation & Security Negative Tests`

---

## 3. How Cookie Handling Works in Postman

This application uses **HTTP-only cookies** for security.
- Postman includes a built-in **Cookie Jar** that automatically captures `Set-Cookie` response headers from requests to `localhost`.
- Subsequent requests to `localhost:5000` automatically send this cookie in the `Cookie` request header without any manual copying.
- To view active cookies: In Postman, click the **Cookies** link located just below the **Send** button on any request. Look for domain `localhost` and cookie name `token`.

---

## 4. Step-by-Step Testing Flow

### Step 1: Register a New User
- **Request**: `1.1 Register User (Success)`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/auth/register` (resolves to `http://localhost:5000/api/auth/register`)
- **Body (JSON)**:
  ```json
  {
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "password": "Secret123!",
    "confirmPassword": "Secret123!"
  }
  ```
- **Expected Status**: `201 Created`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully. Please login to continue.",
    "user": {
      "id": "...",
      "name": "Alice Johnson",
      "email": "alice.johnson@example.com",
      "role": "user"
    }
  }
  ```

---

### Step 2: Login to Authenticate and Receive Cookie
- **Request**: `1.2 Login User (Success)`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/auth/login`
- **Body (JSON)**:
  ```json
  {
    "email": "alice.johnson@example.com",
    "password": "Secret123!"
  }
  ```
- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "user": {
      "id": "...",
      "name": "Alice Johnson",
      "email": "alice.johnson@example.com",
      "role": "user"
    }
  }
  ```
- **Verify Cookie**:
  - In Postman, check the response headers tab: `Set-Cookie: token=eyJhbGciOi...; Path=/; HttpOnly; SameSite=Lax`.
  - Click the **Cookies** link under the **Send** button. You will see `token` saved under `localhost`.

---

### Step 3: Access Protected Route (`/api/auth/me`)
- **Request**: `1.3 Get Current User Profile (Success - Protected)`
- **Method**: `GET`
- **URL**: `{{baseUrl}}/auth/me`
- **Headers**: No manual Authorization header needed (Postman sends the cookie automatically).
- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": "...",
      "name": "Alice Johnson",
      "email": "alice.johnson@example.com",
      "role": "user",
      "createdAt": "..."
    }
  }
  ```

---

### Step 4: Logout
- **Request**: `1.4 Logout User (Success)`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/auth/logout`
- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully."
  }
  ```
- **Cookie Cleared**: The backend sets the `token` cookie with an expiration date in the past (`Expires=Thu, 01 Jan 1970 00:00:00 GMT`), removing it from the client.

---

### Step 5: Verify Protected Access is Blocked After Logout
- **Request**: `1.5 Get Current User After Logout (Unauthorized)`
- **Method**: `GET`
- **URL**: `{{baseUrl}}/auth/me`
- **Expected Status**: `401 Unauthorized`
- **Expected Response**:
  ```json
  {
    "success": false,
    "message": "Access denied. No authentication token provided."
  }
  ```

---

## 5. Negative and Edge Case Testing

Open the folder **2. Validation & Security Negative Tests**:

| Request Name | Endpoint | Test Payload | Expected Code | Expected Error Message |
| :--- | :--- | :--- | :--- | :--- |
| **2.1 Duplicate Email** | `POST /auth/register` | Existing email: `alice.johnson@example.com` | `409 Conflict` | `An account with this email already exists.` |
| **2.2 Invalid Input** | `POST /auth/register` | Missing name, invalid email, mismatched passwords | `400 Bad Request` | Descriptive validation error |
| **2.3 Incorrect Password**| `POST /auth/login` | Email with wrong password `WrongPassword123` | `401 Unauthorized`| `Invalid email or password.` |
| **2.4 Unauthorized Route**| `GET /auth/me` | Call without logging in or without cookie | `401 Unauthorized`| `Access denied. No authentication token provided.` |

---

## 6. Summary of HTTP Status Codes

- `200 OK`: Successful login, profile retrieval, logout.
- `201 Created`: User successfully registered.
- `400 Bad Request`: Input validation failed (empty fields, bad email format, short password, passwords do not match).
- `401 Unauthorized`: Missing or invalid credentials / missing or invalid JWT cookie.
- `409 Conflict`: Registration attempted with an already registered email.
- `429 Too Many Requests`: Exceeded rate limit (brute force protection).
- `500 Internal Server Error`: Unhandled server exception.
