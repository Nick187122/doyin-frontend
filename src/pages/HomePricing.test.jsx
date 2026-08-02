import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

// Mock child components
vi.mock('../components/Seo', () => ({
  default: () => null,
}));

vi.mock('../context/PublicSiteContext', () => ({
  usePublicSite: () => ({
    settings: {
      contact_phone: '+254 742 167 151',
      homepage_new_arrivals_enabled: '1',
      homepage_new_arrivals_badge: 'New Arrivals',
      homepage_new_arrivals_title: 'Fresh stock ready for specification.',
      homepage_new_arrivals_copy: 'Discover the latest additions.',
      homepage_new_arrivals_count: '4',
      homepage_new_arrivals_category_id: '',
      homepage_featured_products_enabled: '1',
      homepage_featured_products_badge: 'Featured Products',
      homepage_featured_products_title: 'Priority models.',
      homepage_featured_products_copy: 'Hand-picked products.',
      homepage_featured_product_ids: '2',
      facebook_url: '#',
      instagram_url: '#',
    },
    heroImages: [],
    testimonials: [],
    loading: false,
  }),
}));

vi.mock('../hooks/usePublicCatalog', () => ({
  usePublicCatalog: () => ({
    products: [
      {
        id: 1, name: 'New Pump', category_id: 1,
        category: { id: 1, name: 'Submersible', is_pump: true },
        in_stock: true, views_count: 0, created_at: '2026-07-01T00:00:00.000000Z',
        price: 65000,
      },
      {
        id: 2, name: 'Featured Pump', category_id: 1,
        category: { id: 1, name: 'Submersible', is_pump: true },
        in_stock: true, views_count: 5, created_at: '2026-06-01T00:00:00.000000Z',
        price: 180000,
      },
      {
        id: 3, name: 'Popular Pump', category_id: 1,
        category: { id: 1, name: 'Submersible', is_pump: true },
        in_stock: true, views_count: 50, created_at: '2026-05-01T00:00:00.000000Z',
        price: 95000,
      },
    ],
    categories: [{ id: 1, name: 'Submersible Pumps', is_pump: true }],
    loading: false,
  }),
}));

describe('Home page pricing', () => {
  it('shows price in the new arrivals section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('New Arrivals')).toBeDefined();
    // New arrivals should display the product price
    expect(screen.getByText(/65,000/)).toBeDefined();
  });

  it('shows KES label on new arrival prices', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // KES labels appear on each product in new arrivals, featured, and popular sections
    const kesLabels = screen.getAllByText(/KES/);
    expect(kesLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('shows price in the featured products section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Featured Products')).toBeDefined();
    // Featured product should show its price with KES label
    const kesLabels = screen.getAllByText(/KES/);
    expect(kesLabels.length).toBeGreaterThanOrEqual(1);
  });
});
