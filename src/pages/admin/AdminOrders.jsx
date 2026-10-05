import React from 'react';
import { ShoppingCart } from 'lucide-react';

const AdminOrders = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <ShoppingCart size={32} color="var(--clr-brand-primary)" />
          <h1 style={{ margin: 0 }}>Order Management</h1>
        </div>
      </div>
      <div className="card">
        <h3>Recent Orders</h3>
        <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Track and manage customer orders.</p>
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--clr-surface-metallic)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--clr-text-muted)' }}>Order data will be loaded from the backend API.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
