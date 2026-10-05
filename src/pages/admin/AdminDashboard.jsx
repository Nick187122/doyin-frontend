import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, PackageOpen, Tag, AlertCircle, Package, Eye, MessageCircle } from 'lucide-react';
import { useProductsQuery, useCategoriesQuery, useInteractionsQuery } from '../../hooks/useCatalogQuery';

const AdminDashboard = () => {
  const { data: products = [], isLoading: productsLoading } = useProductsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: interactions = [] } = useInteractionsQuery();

  const stats = {
    products: products.length,
    categories: categories.length,
    outOfStock: products.filter((p) => !p.in_stock).length,
  };

  const unreadCount = interactions.filter((i) => !i.is_read).length;

  const topProducts = [...products]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5);

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title">
          <LayoutDashboard size={32} color="var(--clr-brand-primary)" />
          <h1 style={{ margin: 0 }}>Dashboard</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>Total Products</h4>
            <div style={{ padding: '0.4rem', background: 'rgba(0, 212, 255, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <PackageOpen size={18} color="var(--clr-brand-secondary)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.1 }}>
            {productsLoading ? '...' : stats.products}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>In catalog</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>Categories</h4>
            <div style={{ padding: '0.4rem', background: 'rgba(2, 101, 192, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <Tag size={18} color="var(--clr-brand-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.1 }}>
            {categoriesLoading ? '...' : stats.categories}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>Active categories</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>Out of Stock</h4>
            <div style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <Package size={18} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.1, color: stats.outOfStock > 0 ? '#ef4444' : 'inherit' }}>
            {productsLoading ? '...' : stats.outOfStock}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>Need restocking</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>Unread Inquiries</h4>
            <div style={{ padding: '0.4rem', background: unreadCount > 0 ? 'rgba(255, 183, 3, 0.15)' : 'rgba(22, 163, 74, 0.1)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
              <MessageCircle size={18} color={unreadCount > 0 ? '#d97706' : '#16a34a'} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.1, color: unreadCount > 0 ? '#d97706' : '#16a34a' }}>
            {unreadCount}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>{unreadCount > 0 ? 'Needs attention' : 'All caught up'}</span>
        </div>
      </div>

      <div className="admin-dashboard-split">
        <div className="card" style={{ marginBottom: '0', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Eye size={20} color="var(--clr-brand-secondary)" />
            <h3 style={{ margin: 0 }}>Most Viewed Products</h3>
          </div>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Views</th>
                </tr>
              </thead>
              <tbody>
                {productsLoading ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}><div className="spinner" /></td></tr>
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

        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/inventory" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              <PackageOpen size={16} /> Manage Products
            </Link>
            <Link to="/admin/categories" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <Tag size={16} /> Manage Categories
            </Link>
            <Link to="/admin/messages" className="btn btn-outline" style={{ justifyContent: 'flex-start', position: 'relative' }}>
              <AlertCircle size={16} /> View Alerts
              {unreadCount > 0 && (
                <span style={{ marginLeft: 'auto', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)', background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
