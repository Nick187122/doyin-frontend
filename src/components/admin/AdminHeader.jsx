import React from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = ({ onMenuToggle, sidebarOpen = false }) => {
  return (
    <header className="admin-header">
      <div className="admin-header-leading">
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={onMenuToggle}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="admin-header-search">
          <Search size={18} color="var(--clr-text-muted)" />
          <input type="text" placeholder="Search orders, products, customers..." aria-label="Search the admin panel" />
        </div>
      </div>

      <div className="admin-header-actions">
        <Link to="/admin/messages" className="admin-action-btn" title="View Messages & Alerts" aria-label="View messages and alerts">
          <Bell size={20} />
          <span className="admin-badge-indicator"></span>
        </Link>
        
        <Link to="/admin/settings" className="admin-user-profile" style={{ textDecoration: 'none' }}>
          <div className="admin-avatar">AD</div>
          <div className="admin-user-info">
            <span className="admin-user-name">Admin User</span>
            <span className="admin-user-role">Super Administrator</span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;
