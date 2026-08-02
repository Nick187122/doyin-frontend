import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePublicCatalog, getCachedPublicCatalog } from './usePublicCatalog';
import api from '../services/api';

// Mock API
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
  AUTH_TOKEN_KEY: 'admin_token',
  DEVICE_TOKEN_KEY: 'device_token',
  API_BASE_URL: 'https://test.example.com/api',
  API_ORIGIN: 'https://test.example.com',
}));

const mockProducts = [
  { id: 1, name: 'Pump A', category_id: 1, category: { id: 1, name: 'Cat 1' }, in_stock: true },
  { id: 2, name: 'Pump B', category_id: 1, category: { id: 1, name: 'Cat 1' }, in_stock: false },
];

const mockCategories = [
  { id: 1, name: 'Cat 1', is_pump: true, has_ideal_power: true },
];

describe('usePublicCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('fetches and returns products and categories', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/public/products') return Promise.resolve({ data: mockProducts });
      if (url === '/public/categories') return Promise.resolve({ data: mockCategories });
      return Promise.reject(new Error('Unknown URL'));
    });

    const { result } = renderHook(() => usePublicCatalog());

    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.categories).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(2);
    expect(result.current.categories).toHaveLength(1);
  });

  it('caches data in sessionStorage', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/public/products') return Promise.resolve({ data: mockProducts });
      if (url === '/public/categories') return Promise.resolve({ data: mockCategories });
      return Promise.reject(new Error('Unknown URL'));
    });

    const { result } = renderHook(() => usePublicCatalog());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const cached = getCachedPublicCatalog();
    expect(cached).not.toBeNull();
    expect(cached.products).toHaveLength(2);
    expect(cached.categories).toHaveLength(1);
  });

  it('uses cached data when available', async () => {
    const cacheData = {
      products: [{ id: 99, name: 'Cached Product', category_id: 1 }],
      categories: [{ id: 1, name: 'Cached Cat' }],
    };

    sessionStorage.setItem(
      'public_catalog_data',
      JSON.stringify({ timestamp: Date.now(), data: cacheData })
    );

    const { result } = renderHook(() => usePublicCatalog());

    expect(result.current.loading).toBe(false);
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].name).toBe('Cached Product');
    expect(result.current.categories[0].name).toBe('Cached Cat');
  });
});
