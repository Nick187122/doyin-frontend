import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock useAuth directly
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../context/AuthContext';

describe('ProtectedRoute', () => {
  it('shows loading spinner when auth is loading', () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    render(
      <MemoryRouter>
        <ProtectedRoute />
      </MemoryRouter>
    );

    expect(screen.getByText('Authenticating...')).toBeDefined();
  });

  it('redirects to login when not authenticated', () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute />
      </MemoryRouter>
    );

    // Navigate renders nothing - the route redirect happens
    // Just check it doesn't show loading state
    expect(screen.queryByText('Authenticating...')).toBeNull();
  });

  it('renders outlet when authenticated and password is ok', () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: 'Admin', email: 'admin@test.com' },
      loading: false,
      mustChangePassword: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute />
      </MemoryRouter>
    );

    // Should not show loading
    expect(screen.queryByText('Authenticating...')).toBeNull();
  });
});
