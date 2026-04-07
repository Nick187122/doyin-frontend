import React, { useState, useEffect } from 'react';
import { Package, Droplets, Search, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePublicCatalog } from '../hooks/usePublicCatalog';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Products' },
  { value: 'pump', label: 'Pump Types' },
  { value: 'other', label: 'Accessories and Other' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'with-flow-rate', label: 'With Flow Rate' },
  { value: 'with-height', label: 'With Max Height' },
  { value: 'with-depth', label: 'With Recommended Depth' },
  { value: 'with-ideal-power', label: 'With Ideal Power' },
];

const matchesViewFilter = (product, selectedView) => {
  switch (selectedView) {
    case 'pump': return product.category?.is_pump ?? true;
    case 'other': return !(product.category?.is_pump ?? true);
    case 'in-stock': return Boolean(product.in_stock);
    case 'with-flow-rate': return Boolean(product.max_flow_rate);
    case 'with-height': return Boolean(product.max_height);
    case 'with-depth': return Boolean(product.recommended_depth);
    case 'with-ideal-power': return Boolean(product.ideal_power);
    default: return true;
  }
};

const Products = () => {
  const { products, categories, loading } = usePublicCatalog();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read ?category=ID from URL on first load
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('all');

  // Keep URL in sync when category filter changes
  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    if (val === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: val });
    }
  };

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const categoryFiltered = selectedCategory === 'all'
    ? products
    : products.filter((product) => String(product.category_id) === String(selectedCategory));

  const filtered = categoryFiltered
    .filter((product) => matchesViewFilter(product, selectedView))
    .filter((product) => {
      if (!normalizedQuery) return true;
      const haystack = [product.name, product.description, product.category?.name, product.max_flow_rate, product.max_height, product.recommended_depth, product.ideal_power]
        .filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    });

  const hasActiveFilters = selectedCategory !== 'all' || selectedView !== 'all' || normalizedQuery;

  return (
    <div className="container section-padding">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Our Products</h1>
        <p style={{ color: 'var(--clr-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Explore our range of high-quality pumps, accessories and support products built for reliability and efficiency.
        </p>
      </div>

      <div style={{ maxWidth: '920px', margin: '0 auto 1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-full)', padding: '0.5rem 0.75rem 0.5rem 1rem', boxShadow: 'var(--shadow-sm)' }}>
        <Search size={18} color="var(--clr-text-muted)" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by name, description, category or specification..."
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', fontFamily: 'inherit' }}
        />
        <button type="button" className="btn btn-primary" style={{ padding: '0.55rem 1rem' }}>
          Search
        </button>
      </div>

      <div style={{ maxWidth: '920px', margin: '0 auto 2rem', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem' }}>
          <SlidersHorizontal size={18} color="var(--clr-brand-primary)" />
          <strong>Filter Products</strong>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ marginLeft: 'auto', padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
              onClick={() => {
                setSelectedView('all');
                setSearchTerm('');
                handleCategoryChange('all');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--clr-text-muted)' }}>View By</label>
            <select value={selectedView} onChange={(e) => setSelectedView(e.target.value)} style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '0.92rem', background: '#fff' }}>
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--clr-text-muted)' }}>Category</label>
            <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '0.92rem', background: '#fff' }}>
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'end' }}>
            <div style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px dashed var(--clr-border)', borderRadius: 'var(--radius-md)', background: 'var(--clr-bg-page)', color: 'var(--clr-text-muted)', fontSize: '0.86rem' }}>
              Showing <strong style={{ color: 'var(--clr-text-main)' }}>{filtered.length}</strong> of <strong style={{ color: 'var(--clr-text-main)' }}>{products.length}</strong> products
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--clr-text-muted)' }}>
          <Droplets size={32} style={{ animation: 'pulse 1.5s infinite' }} />
          <p style={{ marginTop: '1rem' }}>Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--clr-text-muted)' }}>
          <Package size={48} color="var(--clr-border)" />
          <p style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>
            {hasActiveFilters ? 'No products matched your current search and filter combination.' : 'No products available yet. Check back soon!'}
          </p>
          {hasActiveFilters && (
            <a
              href={`https://wa.me/254742167151?text=${encodeURIComponent(`Hi, I could not find the product I need. Search: "${searchTerm.trim() || 'none'}". Please assist me.`)}`}
              className="btn btn-outline" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <MessageCircle size={16} /> Contact Sales
            </a>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((product) => (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
              {/* Fixed aspect-ratio image container — responsive on all screens */}
              <div style={{ aspectRatio: '16/10', background: 'var(--clr-surface-metallic)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                ) : (
                  <Droplets size={48} color="var(--clr-border)" />
                )}
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {product.category && (
                  <span style={{ display: 'inline-block', alignSelf: 'flex-start', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(2,101,192,0.1)', color: 'var(--clr-brand-primary)', border: '1px solid rgba(2,101,192,0.2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {product.category.name}
                  </span>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{product.name}</h3>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '4px', background: product.in_stock ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: product.in_stock ? '#10b981' : '#ef4444' }}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {product.description && (
                  <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>{product.description}</p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                  {product.max_flow_rate && (<div style={{ background: 'var(--clr-bg-page)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}><span style={{ color: 'var(--clr-text-muted)', display: 'block', fontSize: '0.7rem' }}>Flow Rate</span><strong>{product.max_flow_rate}</strong></div>)}
                  {product.max_height && (<div style={{ background: 'var(--clr-bg-page)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}><span style={{ color: 'var(--clr-text-muted)', display: 'block', fontSize: '0.7rem' }}>Max Height</span><strong>{product.max_height}</strong></div>)}
                  {product.recommended_depth && (<div style={{ background: 'var(--clr-bg-page)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}><span style={{ color: 'var(--clr-text-muted)', display: 'block', fontSize: '0.7rem' }}>Rec. Depth</span><strong>{product.recommended_depth}</strong></div>)}
                  {product.ideal_power && (<div style={{ background: '#fef3c7', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a' }}><span style={{ color: '#92400e', display: 'block', fontSize: '0.7rem' }}>Ideal Power</span><strong style={{ color: '#92400e' }}>{product.ideal_power}</strong></div>)}
                </div>

                <Link to={`/products/${product.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
