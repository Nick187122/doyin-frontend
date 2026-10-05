import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Settings, LogOut, Image, Mail, Headset, MessageSquareQuote, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen = false, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Tapping a destination should never leave the drawer covering the new page.
  const handleNavigate = () => {
    if (onClose) onClose();
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} />, end: true },
    { to: '/admin/inventory', label: 'Inventory', icon: <Package size={20} /> },
    { to: '/admin/categories', label: 'Categories', icon: <Tag size={20} /> },
    { to: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    { to: '/admin/messages', label: 'Messages & Alerts', icon: <Mail size={20} /> },
    { to: '/admin/testimonials', label: 'Testimonials', icon: <MessageSquareQuote size={20} /> },
    { to: '/admin/hero-images', label: 'Hero Images', icon: <Image size={20} /> },
    { to: '/admin/salespersons', label: 'Sales Reps', icon: <Headset size={20} /> },
    { to: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`admin-sidebar${isOpen ? ' open' : ''}`} aria-label="Admin navigation">
      <div className="admin-sidebar-logo">
        <img src="/images/logo.jpg" alt="Doyin Pumps Kenya logo" className="admin-sidebar-logo-image" />
        <span>Doyin Pumps Kenya</span>
        <button type="button" className="admin-sidebar-close" onClick={onClose} aria-label="Close navigation">
          <X size={20} />
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={handleNavigate}
            className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
