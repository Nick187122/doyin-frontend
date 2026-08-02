import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import api from '../services/api';
import { AUTH_TOKEN_KEY, DEVICE_TOKEN_KEY } from '../services/api';

// Mock API
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
  AUTH_TOKEN_KEY: 'admin_token',
  DEVICE_TOKEN_KEY: 'device_token',
  API_BASE_URL: 'https://test.example.com/api',
  API_ORIGIN: 'https://test.example.com',
}));

// Test component that uses the hook
function TestConsumer() {
  const { user, loading, login, logout, mustChangePassword } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="auth-state">
        {user ? `Logged in as ${user.name}` : 'Not logged in'}
      </div>
      <div data-testid="must-change-password">
        {mustChangePassword ? 'Must change password' : 'Password OK'}
      </div>
      <button onClick={() => login('admin@test.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('shows loading state when token exists and API call is pending', async () => {
    // Set a token so fetchMe actually calls the API
    sessionStorage.setItem(AUTH_TOKEN_KEY, 'existing-token');
    // Don't resolve the get request to keep loading state
    api.get.mockReturnValue(new Promise(() => {}));

    renderWithAuth();

    // The loading div says "Loading..."
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('shows not logged in when no token', async () => {
    api.get.mockResolvedValue({ data: {} });

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('Not logged in');
    });
  });

  it('logs in successfully and shows user', async () => {
    api.get.mockResolvedValue({ data: {} });

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('Not logged in');
    });

    api.post.mockResolvedValue({
      data: {
        token: 'test-token-123',
        user: { id: 1, name: 'Admin User', email: 'admin@test.com' },
        must_change_password: false,
      },
    });

    const userEv = userEvent.setup();
    await userEv.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('Logged in as Admin User');
    });

    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBe('test-token-123');
  });

  it('logs out and clears state', async () => {
    const mockUser = { id: 1, name: 'Admin User', email: 'admin@test.com' };
    api.get.mockResolvedValue({
      data: { user: mockUser, must_change_password: false },
    });

    // Manually set token so fetchMe uses it
    sessionStorage.setItem(AUTH_TOKEN_KEY, 'test-token');

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('Logged in as Admin User');
    });

    api.post.mockResolvedValue({ data: {} });

    const userEv = userEvent.setup();
    await userEv.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('Not logged in');
    });

    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
  });
});
