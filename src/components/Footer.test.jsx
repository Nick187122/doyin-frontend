import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

// Mock usePublicSite
vi.mock('../context/PublicSiteContext', () => ({
  usePublicSite: () => ({
    settings: {
      contact_phone: '+254 700 000 000',
      contact_email: 'test@doyinkenya.com',
      contact_address: 'Nairobi, Kenya',
      facebook_url: 'https://facebook.com/doyin',
      instagram_url: 'https://instagram.com/doyin',
    },
  }),
}));

function renderWithRouter() {
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
}

describe('Footer', () => {
  it('renders the brand section', () => {
    renderWithRouter();
    expect(screen.getByText('Doyin Pumps Kenya')).toBeDefined();
  });

  it('renders quick links', () => {
    renderWithRouter();
    expect(screen.getByText('Home').closest('a').getAttribute('href')).toBe('/');
    expect(screen.getByText('Products').closest('a').getAttribute('href')).toBe('/products');
  });

  it('renders contact information', () => {
    renderWithRouter();
    expect(screen.getByText('+254 700 000 000')).toBeDefined();
    expect(screen.getByText('test@doyinkenya.com')).toBeDefined();
    expect(screen.getByText('Nairobi, Kenya')).toBeDefined();
  });

  it('renders social media links', () => {
    renderWithRouter();
    expect(screen.getByText('Facebook').getAttribute('href')).toBe('https://facebook.com/doyin');
    expect(screen.getByText('Instagram').getAttribute('href')).toBe('https://instagram.com/doyin');
  });

  it('renders the copyright with current year', () => {
    renderWithRouter();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeDefined();
  });
});
