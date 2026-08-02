import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Products from './Products';

// Mock child components
vi.mock('../components/Seo', () => ({
  default: () => null,
}));

vi.mock('../hooks/usePublicCatalog', () => ({
  usePublicCatalog: () => ({
    products: [
      {
        id: 1, name: 'Pump A', description: 'A good pump',
        category_id: 1, category: { id: 1, name: 'Submersible', is_pump: true },
        in_stock: true, views_count: 0, created_at: '2026-01-01T00:00:00.000000Z',
        max_flow_rate: '10 m³/h', max_height: '50 m',
        recommended_depth: '20 m', ideal_power: '3 kW',
        price: 45000,
      },
      {
        id: 2, name: 'Pump B', description: 'Another pump',
        category_id: 1, category: { id: 1, name: 'Submersible', is_pump: true },
        in_stock: true, views_count: 0, created_at: '2026-01-02T00:00:00.000000Z',
        max_flow_rate: null, max_height: null,
        recommended_depth: null, ideal_power: null,
        price: null,
      },
    ],
    categories: [{ id: 1, name: 'Submersible Pumps', is_pump: true }],
    loading: false,
  }),
}));

describe('Products page pricing', () => {
  it('displays price formatted in KES on product cards', () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    // Product with a price should show KES amount
    expect(screen.getByText(/45,000/)).toBeDefined();
  });

  it('does not show price section when price is null', () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    // Pump A has a price — should show KES
    expect(screen.getByText(/KES/)).toBeDefined();

    // Pump B has no price — should NOT show any KES-prefixed price
    // (The KES element from Pump A exists, but Pump B's card has no price)
    const pumpBCard = screen.getByText('Pump B').closest('a');
    expect(pumpBCard.textContent).not.toMatch(/KES/);
  });

  it('renders price in a dedicated price element', () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    const priceElement = screen.getByText(/KES/);
    expect(priceElement).toBeDefined();
  });
});
