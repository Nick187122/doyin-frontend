import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
      homepage_featured_product_ids: '',
      facebook_url: '#',
      instagram_url: '#',
    },
    heroImages: [{ id: 1, image_path: '/test.jpg', title: 'Banner 1' }],
    testimonials: [
      { id: 1, name: 'John', content: 'Great!', rating: 5, avatar_url: null, video_url: null, title: 'CEO', company: 'Co' },
    ],
    loading: false,
  }),
}));

vi.mock('../hooks/usePublicCatalog', () => ({
  usePublicCatalog: () => ({
    products: [
      { id: 1, name: 'Pump A', category_id: 1, category: { id: 1, name: 'Submersible', is_pump: true }, in_stock: true, views_count: 5, created_at: '2026-06-01T00:00:00.000000Z' },
      { id: 2, name: 'Pump B', category_id: 1, category: { id: 1, name: 'Submersible', is_pump: true }, in_stock: true, views_count: 3, created_at: '2026-05-01T00:00:00.000000Z' },
    ],
    categories: [
      { id: 1, name: 'Submersible Pumps', is_pump: true },
    ],
    loading: false,
  }),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the hero section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Premium Fluid Systems')).toBeDefined();
    expect(screen.getByText(/Water infrastructure/)).toBeDefined();
  });

  it('renders the features section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Why Doyin')).toBeDefined();
    expect(screen.getByText('High Efficiency')).toBeDefined();
    expect(screen.getByText('Durable Build')).toBeDefined();
    expect(screen.getByText('Deep Well Ready')).toBeDefined();
  });

  it('renders testimonials section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Testimonials')).toBeDefined();
    expect(screen.getByText(/Great!/)).toBeDefined();
  });

  it('renders the View Catalog button', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('View Catalog')).toBeDefined();
  });

  it('renders the hero carousel with hero images', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByAltText('Banner 1')).toBeDefined();
  });

  it('renders catalog structure section with categories', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Catalog Structure')).toBeDefined();
    expect(screen.getByText('Submersible Pumps')).toBeDefined();
  });
});
