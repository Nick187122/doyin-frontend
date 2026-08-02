import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PublicSiteProvider, usePublicSite } from './PublicSiteContext';
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

function TestConsumer() {
  const { settings, heroImages, testimonials, loading } = usePublicSite();

  if (loading) return <div>Loading site data...</div>;

  return (
    <div>
      <div data-testid="phone">{settings.contact_phone}</div>
      <div data-testid="hero-count">{heroImages.length}</div>
      <div data-testid="testimonial-count">{testimonials.length}</div>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <PublicSiteProvider>
      <TestConsumer />
    </PublicSiteProvider>
  );
}

describe('PublicSiteContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('shows loading state initially', () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderWithProvider();
    expect(screen.getByText('Loading site data...')).toBeDefined();
  });

  it('fetches and provides settings, hero images, and testimonials', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/public/settings') return Promise.resolve({ data: { contact_phone: '+254700000000' } });
      if (url === '/public/hero-images') return Promise.resolve({ data: [{ id: 1, title: 'Hero 1' }] });
      if (url === '/public/testimonials') return Promise.resolve({ data: [{ id: 1, name: 'Testimonial 1' }] });
      return Promise.reject(new Error('Unknown URL'));
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('phone').textContent).toBe('+254700000000');
    });

    expect(screen.getByTestId('hero-count').textContent).toBe('1');
    expect(screen.getByTestId('testimonial-count').textContent).toBe('1');
  });

  it('uses cached data when available', async () => {
    const cacheData = {
      settings: { contact_phone: '+254711111111' },
      heroImages: [{ id: 99, title: 'Cached Hero' }],
      testimonials: [],
    };

    sessionStorage.setItem(
      'public_site_data',
      JSON.stringify({ timestamp: Date.now(), data: cacheData })
    );

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('phone').textContent).toBe('+254711111111');
    });

    expect(screen.getByTestId('hero-count').textContent).toBe('1');
  });

  it('falls back to defaults when API fails', async () => {
    api.get.mockRejectedValue(new Error('Network error'));

    renderWithProvider();

    await waitFor(() => {
      // Should use DEFAULT_SETTINGS values
      expect(screen.getByTestId('phone').textContent).toBe('+254 742 167 151');
    });
  });
});
