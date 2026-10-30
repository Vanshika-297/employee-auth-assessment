import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import * as authApi from '../api/authApi.js';

// Mock authApi functions
vi.mock('../api/authApi.js', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  getCurrentUser: vi.fn(),
  logoutUser: vi.fn()
}));

const renderLogin = async () => {
  let result;
  await act(async () => {
    result = render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
  });
  return result;
};

describe('Frontend Login Form Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authApi.getCurrentUser.mockResolvedValue({ success: false, user: null });
  });

  it('renders login form elements correctly including show/hide password control', async () => {
    await renderLogin();

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create an account/i })).toBeInTheDocument();
  });

  it('toggles password visibility when show/hide button is clicked', async () => {
    const user = userEvent.setup();
    await renderLogin();

    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button', { name: /show password/i });
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('rejects invalid email and shows client validation error', async () => {
    const user = userEvent.setup();
    await renderLogin();

    await user.type(screen.getByLabelText(/email address/i), 'invalid-email');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(authApi.loginUser).not.toHaveBeenCalled();
  });

  it('displays loading state during login API request', async () => {
    const user = userEvent.setup();
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    authApi.loginUser.mockReturnValue(promise);

    await renderLogin();

    await user.type(screen.getByLabelText(/email address/i), 'valid@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();

    await act(async () => {
      resolvePromise({
        success: true,
        user: { id: '1', name: 'Valid User', email: 'valid@example.com' }
      });
    });
  });

  it('displays API error alert when login fails with invalid credentials', async () => {
    const user = userEvent.setup();
    authApi.loginUser.mockRejectedValue({
      response: {
        data: {
          success: false,
          message: 'Invalid email or password.'
        }
      }
    });

    await renderLogin();

    await user.type(screen.getByLabelText(/email address/i), 'valid@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'WrongPassword');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/invalid email or password/i);
  });
});
