import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
  AUTH_TOKEN_KEY: 'admin_token',
  DEVICE_TOKEN_KEY: 'device_token',
  API_BASE_URL: 'https://test.example.com/api',
  API_ORIGIN: 'https://test.example.com',
}));

import api from '../../services/api';

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard title and stats after loading', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/products') return Promise.resolve({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] });
      if (url === '/categories') return Promise.resolve({ data: [{ id: 1 }, { id: 2 }] });
      return Promise.reject(new Error('Unknown'));
    });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeDefined();
      expect(screen.getByText('Total Products')).toBeDefined();
    });

    expect(screen.getByText(/3/)).toBeDefined();
  });

  it('renders quick action links', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/products') return Promise.resolve({ data: [] });
      if (url === '/categories') return Promise.resolve({ data: [] });
      return Promise.reject(new Error('Unknown'));
    });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Manage Products')).toBeDefined();
      expect(screen.getByText('Manage Categories')).toBeDefined();
    });
  });

  it('shows system status', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/products') return Promise.resolve({ data: [] });
      if (url === '/categories') return Promise.resolve({ data: [] });
      return Promise.reject(new Error('Unknown'));
    });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Online')).toBeDefined();
      expect(screen.getByText('All systems operational')).toBeDefined();
    });
  });

  it('displays top performing products table', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/products') return Promise.resolve({
        data: [
          { id: 1, name: 'Top Pump', category: { name: 'Submersible' }, views_count: 100 },
          { id: 2, name: 'Second Pump', category: { name: 'Surface' }, views_count: 50 },
        ],
      });
      if (url === '/categories') return Promise.resolve({ data: [] });
      return Promise.reject(new Error('Unknown'));
    });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Top Performing Products')).toBeDefined();
    });

    expect(screen.getByText('Top Pump')).toBeDefined();
    expect(screen.getByText('Second Pump')).toBeDefined();
  });

  it('renders top products table with zero-view products', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/products') return Promise.resolve({ data: [{ id: 1, name: 'New Pump', category: { name: 'Accessories' }, views_count: 0 }] });
      if (url === '/categories') return Promise.resolve({ data: [] });
      return Promise.reject(new Error('Unknown'));
    });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Top Performing Products')).toBeDefined();
    });

    expect(screen.getByText('New Pump')).toBeDefined();
    // The views count is 0, but there may be multiple 0 elements on the page
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(1);
  });
});
