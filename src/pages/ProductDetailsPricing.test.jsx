import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductDetails from './ProductDetails';

// Mock child components
vi.mock('../components/Seo', () => ({
  default: () => null,
}));

vi.mock('../components/EnquiryModal', () => ({
  default: ({ product, onClose }) => null,
}));

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
  AUTH_TOKEN_KEY: 'admin_token',
  DEVICE_TOKEN_KEY: 'device_token',
  API_BASE_URL: 'https://test.example.com/api',
  API_ORIGIN: 'https://test.example.com',
}));

vi.mock('../hooks/usePublicCatalog', () => ({
  getCachedPublicCatalog: () => null,
}));

import api from '../services/api';

const productWithPrice = {
  id: 1,
  name: 'Premium Pump 3000',
  description: 'A high-end pump for demanding applications.',
  category_id: 1,
  category: { id: 1, name: 'Submersible', is_pump: true, has_ideal_power: true },
  image_url: null,
  max_flow_rate: '20 m³/h',
  max_height: '100 m',
  recommended_depth: '40 m',
  ideal_power: '5.5 kW',
  performance_curves: null,
  in_stock: true,
  views_count: 10,
  price: 250000,
};

const productWithoutPrice = {
  ...productWithPrice,
  id: 2,
  name: 'Basic Pump',
  price: null,
};

describe('ProductDetails pricing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays price in KES when product has a price', async () => {
    api.get.mockResolvedValue({ data: productWithPrice });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <ProductDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/250,000/)).toBeDefined();
    });
  });

  it('shows price label for KES', async () => {
    api.get.mockResolvedValue({ data: productWithPrice });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <ProductDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/KES/)).toBeDefined();
    });
  });

  it('does not show price section when price is null', async () => {
    api.get.mockResolvedValue({ data: productWithoutPrice });

    render(
      <MemoryRouter initialEntries={['/products/2']}>
        <ProductDetails />
      </MemoryRouter>
    );

    // Product renders successfully
    await waitFor(() => {
      expect(screen.getByText('Basic Pump')).toBeDefined();
    });

    // No price should be displayed
    expect(screen.queryByText(/KES/)).toBeNull();
  });

  it('includes price in the technical specifications section', async () => {
    api.get.mockResolvedValue({ data: productWithPrice });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <ProductDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Technical Specifications')).toBeDefined();
    });

    // Price should be part of the spec list
    expect(screen.getByText(/250,000/)).toBeDefined();
  });
});
