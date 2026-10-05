import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('renders contact sales CTA that offers WhatsApp and call options', () => {
    renderWithRouter();

    const cta = screen.getByRole('button', { name: /contact sales/i });
    expect(cta).toBeDefined();
    expect(cta.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(cta);

    const whatsapp = screen.getByRole('menuitem', { name: /whatsapp/i });
    const call = screen.getByRole('menuitem', { name: /0742 167 151/i });

    expect(whatsapp.getAttribute('href')).toContain('wa.me/254742167151');
    expect(call.getAttribute('href')).toBe('tel:+254742167151');
    expect(cta.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes the contact sales options on Escape', () => {
    renderWithRouter();

    const cta = screen.getByRole('button', { name: /contact sales/i });
    fireEvent.click(cta);
    expect(screen.getByRole('menuitem', { name: /whatsapp/i })).toBeDefined();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menuitem', { name: /whatsapp/i })).toBeNull();
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
