import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Settings, LogOut, Image, Mail, Headset } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img src="/images/logo.png?v=2" alt="Doyin Kenya logo" className="admin-sidebar-logo-image" />
        <span>Doyin Admin</span>
      </div>
      
      <nav className="admin-sidebar-nav">
        <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/admin/inventory" className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
          <Package size={20} />
          <span>Inventory</span>
        </NavLink>

        <NavLink to="/admin/categories" className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
          <Tag size={20} />
          <span>Categories</span>
        </NavLink>
        
        <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
          <ShoppingCart size={20} />
          <span>Orders</span>
        </NavLink>
        
        <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
          <Users size={20} />
          <span>Users</span>
        </NavLink>

        <NavLink to="/admin/messages" className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
          <Mail size={20} />
          <span>Messages & Alerts</span>
        </NavLink>

        <NavLink to="/admin/hero-images" className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
          <Image size={20} />
          <span>Hero Images</span>
        </NavLink>
        
        <NavLink to="/admin/salespersons" className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
          <Headset size={20} />
          <span>Sales Reps</span>
        </NavLink>

        <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
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
