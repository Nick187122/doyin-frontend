import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ logout: vi.fn() })),
}));

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/admin/inventory']}>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="inventory" element={<p>Inventory page</p>} />
          <Route path="categories" element={<p>Categories page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

const getSidebar = () => document.querySelector('aside.admin-sidebar');
const getToggle = () => screen.getByRole('button', { name: /^(open|close) menu$/i });
const getBackdrop = () => document.querySelector('.admin-sidebar-backdrop');

describe('AdminLayout mobile drawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the sidebar, header and nested route content', () => {
    renderLayout();

    expect(getSidebar()).not.toBeNull();
    expect(screen.getByText('Inventory page')).toBeDefined();
    expect(screen.getByRole('button', { name: /open menu/i })).toBeDefined();
  });

  it('starts with the drawer closed', () => {
    renderLayout();

    expect(getSidebar().classList.contains('open')).toBe(false);
  });

  it('opens and closes the drawer from the header toggle', () => {
    renderLayout();

    fireEvent.click(getToggle());
    expect(getSidebar().classList.contains('open')).toBe(true);

    fireEvent.click(getToggle());
    expect(getSidebar().classList.contains('open')).toBe(false);
  });

  it('opens and closes the drawer from the sidebar close control', () => {
    renderLayout();

    fireEvent.click(getToggle());
    expect(getSidebar().classList.contains('open')).toBe(true);

    fireEvent.click(document.querySelector('.admin-sidebar-close'));
    expect(getSidebar().classList.contains('open')).toBe(false);
  });

  it('closes the drawer when Escape is pressed', () => {
    renderLayout();

    fireEvent.click(getToggle());
    expect(getSidebar().classList.contains('open')).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(getSidebar().classList.contains('open')).toBe(false);
  });

  it('closes the drawer when the backdrop is clicked', () => {
    renderLayout();

    fireEvent.click(getToggle());
    expect(getBackdrop()).not.toBeNull();

    fireEvent.click(getBackdrop());
    expect(getSidebar().classList.contains('open')).toBe(false);
  });

  it('closes the drawer after navigating to another admin page', () => {
    renderLayout();

    fireEvent.click(getToggle());
    expect(getSidebar().classList.contains('open')).toBe(true);

    fireEvent.click(screen.getByText('Categories'));
    expect(getSidebar().classList.contains('open')).toBe(false);
  });
});
