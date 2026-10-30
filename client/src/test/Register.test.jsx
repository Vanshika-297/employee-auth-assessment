import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import * as authApi from '../api/authApi.js';

// Mock authApi functions
vi.mock('../api/authApi.js', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  getCurrentUser: vi.fn(),
  logoutUser: vi.fn()
}));

const renderRegister = async () => {
  let result;
  await act(async () => {
    result = render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );
  });
  return result;
};

describe('Frontend Registration Form Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authApi.getCurrentUser.mockResolvedValue({ success: false, user: null });
  });

  it('renders registration form elements correctly', async () => {
    await renderRegister();

    expect(screen.getByRole('heading', { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in here/i })).toBeInTheDocument();
  });

  it('rejects invalid email and shows client validation error', async () => {
    const user = userEvent.setup();
    await renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'not-a-valid-email');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123');

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(authApi.registerUser).not.toHaveBeenCalled();
  });

  it('rejects mismatched passwords with validation error message', async () => {
    const user = userEvent.setup();
    await renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'DifferentPassword456');

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(authApi.registerUser).not.toHaveBeenCalled();
  });

  it('displays loading state during registration API request', async () => {
    const user = userEvent.setup();
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    authApi.registerUser.mockReturnValue(promise);

    await renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123');

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/creating account\.\.\./i)).toBeInTheDocument();

    await act(async () => {
      resolvePromise({ success: true, message: 'User registered successfully' });
    });

    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  it('displays API error alert when registration fails', async () => {
    const user = userEvent.setup();
    authApi.registerUser.mockRejectedValue({
      response: {
        data: {
          success: false,
          message: 'An account with this email already exists. Please login instead.'
        }
      }
    });

    await renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123');

    await user.click(screen.getByRole('button', { name: /register/i }));

    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/already exists/i);
  });
});
