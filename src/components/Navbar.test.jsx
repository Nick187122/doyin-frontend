import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

function renderWithRouter() {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
}

describe('Navbar', () => {
  it('renders the logo', () => {
    renderWithRouter();
    const logo = screen.getByAltText('Doyin Pumps Kenya logo');
    expect(logo).toBeDefined();
    expect(logo.getAttribute('src')).toBe('/images/logo.jpg');
  });

  it('renders navigation links', () => {
    renderWithRouter();
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Products')).toBeDefined();
    expect(screen.getByText('About Us')).toBeDefined();
  });

  it('renders contact sales CTA link', () => {
    renderWithRouter();
    const cta = screen.getByText('Contact Sales');
    expect(cta).toBeDefined();
    expect(cta.getAttribute('href')).toContain('wa.me');
  });

  it('renders mobile menu button', () => {
    renderWithRouter();
    const menuBtn = screen.getByLabelText('Toggle navigation menu');
    expect(menuBtn).toBeDefined();
  });

  it('has correct links on navigation items', () => {
    renderWithRouter();
    expect(screen.getByText('Home').closest('a').getAttribute('href')).toBe('/');
    expect(screen.getByText('Products').closest('a').getAttribute('href')).toBe('/products');
    expect(screen.getByText('About Us').closest('a').getAttribute('href')).toBe('/about');
  });
});
