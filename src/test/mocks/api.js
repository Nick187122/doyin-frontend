import { vi } from 'vitest';

export const mockProduct = (overrides = {}) => ({
  id: 1,
  name: 'Submersible Pump 2000',
  description: 'A high-performance submersible pump',
  category_id: 1,
  category: { id: 1, name: 'Submersible Pumps', is_pump: true, has_ideal_power: true },
  image_url: null,
  max_flow_rate: '10 m³/h',
  max_height: '50 m',
  recommended_depth: '20 m',
  ideal_power: '3 kW',
  performance_curves: null,
  in_stock: true,
  views_count: 0,
  created_at: '2026-01-01T00:00:00.000000Z',
  ...overrides,
});

export const mockCategory = (overrides = {}) => ({
  id: 1,
  name: 'Submersible Pumps',
  is_pump: true,
  has_ideal_power: true,
  ...overrides,
});

export const mockHeroImage = (overrides = {}) => ({
  id: 1,
  image_path: '/storage/heroes/test.jpg',
  image_url: 'https://example.com/storage/heroes/test.jpg',
  title: 'Main Banner',
  is_active: true,
  order: 1,
  ...overrides,
});

export const mockTestimonial = (overrides = {}) => ({
  id: 1,
  name: 'John Doe',
  title: 'CEO',
  company: 'Test Corp',
  content: 'Great products!',
  rating: 5,
  avatar_url: null,
  video_url: null,
  is_visible: true,
  sort_order: 1,
  ...overrides,
});

export const mockSalesperson = (overrides = {}) => ({
  id: 1,
  name: 'Jane Sales',
  phone_number: '+254712345678',
  is_active: true,
  ...overrides,
});

export const mockSetting = (overrides = {}) => ({
  contact_phone: '+254 742 167 151',
  contact_email: 'info@doyinkenya.com',
  contact_address: 'Nairobi, Kenya',
  facebook_url: '#',
  instagram_url: '#',
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
  ...overrides,
});

export const createMockApi = () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
});
