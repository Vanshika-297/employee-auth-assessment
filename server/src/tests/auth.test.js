import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import app from '../app.js';
import User from '../models/User.js';

describe('Backend Auth API Tests', () => {
  const sampleUser = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!'
  };

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user with valid input', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(sampleUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('User registered successfully');
      expect(res.body.user).toBeDefined();
      expect(res.body.user.name).toBe(sampleUser.name);
      expect(res.body.user.email).toBe(sampleUser.email.toLowerCase());
      // Crucial security requirement: never expose password
      expect(res.body.user.password).toBeUndefined();
    });

    it('should reject duplicate email registration with 409 Conflict', async () => {
      // First registration
      await request(app).post('/api/auth/register').send(sampleUser);

      // Attempt duplicate registration
      const res = await request(app)
        .post('/api/auth/register')
        .send(sampleUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should reject invalid registration input (missing fields, short password, mismatched passwords)', async () => {
      // 1. Missing name
      const res1 = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!'
        });
      expect(res1.status).toBe(400);
      expect(res1.body.success).toBe(false);

      // 2. Invalid email
      const res2 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Email',
          email: 'not-an-email',
          password: 'Password123!',
          confirmPassword: 'Password123!'
        });
      expect(res2.status).toBe(400);
      expect(res2.body.message).toMatch(/valid email/i);

      // 3. Password too short (< 6 characters)
      const res3 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Pass',
          email: 'short@example.com',
          password: '123',
          confirmPassword: '123'
        });
      expect(res3.status).toBe(400);
      expect(res3.body.message).toMatch(/at least 6 characters/i);

      // 4. Mismatched passwords
      const res4 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Mismatch Pass',
          email: 'mismatch@example.com',
          password: 'Password123!',
          confirmPassword: 'DifferentPassword123!'
        });
      expect(res4.status).toBe(400);
      expect(res4.body.message).toMatch(/passwords do not match/i);
    });

    it('should store password in database as bcrypt hash, never plaintext', async () => {
      await request(app).post('/api/auth/register').send(sampleUser);

      // Directly query database to inspect stored record
      const dbUser = await User.findOne({ email: sampleUser.email.toLowerCase() });
      expect(dbUser).not.toBeNull();
      expect(dbUser.password).not.toBe(sampleUser.password);
      // Bcrypt hash starts with $2a$ or $2b$
      expect(dbUser.password).toMatch(/^\$2[aby]\$\d+\$/);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create user before testing login
      await request(app).post('/api/auth/register').send(sampleUser);
    });

    it('should authenticate user with correct credentials and set HTTP-only cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: sampleUser.email,
          password: sampleUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(sampleUser.email.toLowerCase());
      expect(res.body.user.password).toBeUndefined();

      // Check HTTP-only cookie header
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const tokenCookie = cookies.find((c) => c.startsWith('token='));
      expect(tokenCookie).toBeDefined();
      expect(tokenCookie).toContain('HttpOnly');
    });

    it('should reject login with incorrect credentials (wrong password & non-existent email)', async () => {
      // Wrong password
      const res1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: sampleUser.email,
          password: 'WrongPassword'
        });
      expect(res1.status).toBe(401);
      expect(res1.body.success).toBe(false);
      expect(res1.body.message).toMatch(/invalid email or password/i);

      // Non-existent email
      const res2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@example.com',
          password: sampleUser.password
        });
      expect(res2.status).toBe(401);
      expect(res2.body.success).toBe(false);
      expect(res2.body.message).toMatch(/invalid email or password/i);
    });
  });

  describe('GET /api/auth/me (Protected Route)', () => {
    let authCookie;

    beforeEach(async () => {
      // Register and login to get valid cookie
      await request(app).post('/api/auth/register').send(sampleUser);
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: sampleUser.email,
          password: sampleUser.password
        });
      authCookie = loginRes.headers['set-cookie'];
    });

    it('should reject access when authentication token is missing', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/no authentication token provided/i);
    });

    it('should reject access when authentication token is invalid', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', ['token=invalid_tampered_jwt_token']);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid or expired/i);
    });

    it('should accept request and return user profile when valid auth cookie is sent', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.name).toBe(sampleUser.name);
      expect(res.body.user.email).toBe(sampleUser.email.toLowerCase());
      expect(res.body.user.password).toBeUndefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear the authentication cookie', async () => {
      const res = await request(app).post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/logged out successfully/i);

      // Verify cookie is cleared (token empty or expired in past)
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const tokenCookie = cookies.find((c) => c.startsWith('token='));
      expect(tokenCookie).toBeDefined();
      // Express clearCookie sets either Expires in past or Max-Age=0 or empty token
      const isCleared =
        tokenCookie.includes('token=;') ||
        tokenCookie.includes('Expires=Thu, 01 Jan 1970') ||
        tokenCookie.includes('Max-Age=0');
      expect(isCleared).toBe(true);
    });
  });
});
