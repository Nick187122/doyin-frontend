import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout-container">
      <AdminSidebar />
      <div className="admin-main-content">
        <AdminHeader />
        <div className="admin-page-content">
          {/* Outlet is where nested routes render their content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
