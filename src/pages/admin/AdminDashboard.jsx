import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, PackageOpen, Tag, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0 });
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
        setStats({ products: pRes.data.length, categories: cRes.data.length });
        
        // Compute top products based on view_count
        const sorted = [...pRes.data].sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        setTopProducts(sorted.slice(0, 5));
      } catch {}
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <LayoutDashboard size={32} color="var(--clr-brand-primary)" />
        <h1 style={{ margin: 0 }}>Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Products count */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>Total Products</h4>
            <div style={{ padding: '0.5rem', background: 'rgba(0, 212, 255, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <PackageOpen size={20} color="var(--clr-brand-secondary)" />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.1 }}>
            {loading ? '…' : stats.products}
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>In catalog</span>
        </div>

        {/* Categories count */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>Categories</h4>
            <div style={{ padding: '0.5rem', background: 'rgba(2, 101, 192, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <Tag size={20} color="var(--clr-brand-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.1 }}>
            {loading ? '…' : stats.categories}
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>Active categories</span>
        </div>

        {/* System status */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>System Status</h4>
            <div style={{ padding: '0.5rem', background: 'rgba(22, 163, 74, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <TrendingUp size={20} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', lineHeight: 1.1, color: '#16a34a' }}>
            Online
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>All systems operational</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem' }}>
        {/* Top Performing Products */}
        <div className="card" style={{ marginBottom: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={20} color="var(--clr-brand-secondary)" />
            <h3 style={{ margin: 0 }}>Top Performing Products</h3>
          </div>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Inquiries/Views</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>Loading data...</td></tr>
                ) : topProducts.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>No product views recorded yet.</td></tr>
                ) : (
                  topProducts.map((product) => (
                    <tr key={product.id}>
                      <td style={{ fontWeight: 500 }}>{product.name}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--clr-bg-page)', borderRadius: '4px' }}>
                          {product.category?.name}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--clr-brand-secondary)' }}>{product.views_count || 0}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="/admin/inventory" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              <PackageOpen size={16} /> Manage Products
            </a>
            <a href="/admin/categories" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <Tag size={16} /> Manage Categories
            </a>
            <a href="/admin/messages" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <AlertCircle size={16} /> View Alerts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
