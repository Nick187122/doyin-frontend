import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import Seo from '../Seo';
import './AdminLayout.css';
import './admin-responsive.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(() => window.location.pathname);
  const { pathname } = useLocation();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((open) => !open), []);

  // Navigating away should never leave the drawer covering the new page.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setSidebarOpen(false);
  }

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeSidebar();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, closeSidebar]);

  return (
    <div className={`admin-layout-container${sidebarOpen ? ' admin-sidebar-is-open' : ''}`}>
      <Seo
        title="Admin Dashboard | Doyin Pumps Kenya"
        description="Doyin Pumps Kenya administration portal."
        path="/admin"
        noindex
        nofollow
      />
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      {/* Tapping the dimmed backdrop dismisses the drawer; hidden from a11y tree
          because it duplicates the header and sidebar close controls. */}
      <div
        className="admin-sidebar-backdrop"
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <div className="admin-main-content">
        <AdminHeader onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="admin-page-content">
          {/* Outlet is where nested routes render their content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
