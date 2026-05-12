import { useState } from 'react';
import { Package, Droplets, Search, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import Seo from '../components/Seo';
import './Products.css';

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
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('all');

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);

    if (value === 'all') {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: value });
  };

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const categoryFiltered = selectedCategory === 'all'
    ? products
    : products.filter((product) => String(product.category_id) === String(selectedCategory));

  const filtered = categoryFiltered
    .filter((product) => matchesViewFilter(product, selectedView))
    .filter((product) => {
      if (!normalizedQuery) return true;

      const haystack = [
        product.name,
        product.description,
        product.category?.name,
        product.max_flow_rate,
        product.max_height,
        product.recommended_depth,
        product.ideal_power,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

  const hasActiveFilters = selectedCategory !== 'all' || selectedView !== 'all' || normalizedQuery;
  const selectedCategoryName = categories.find((category) => String(category.id) === String(selectedCategory))?.name;
  const productsTitle = selectedCategoryName
    ? `${selectedCategoryName} Products | Doyin Pumps Kenya`
    : 'Products | Doyin Pumps Kenya';
  const productsDescription = selectedCategoryName
    ? `Browse ${selectedCategoryName.toLowerCase()} and related pump solutions from Doyin Pumps Kenya. Explore specifications, stock status, and product details.`
    : 'Browse submersible water pumps, accessories, and industrial pump solutions from Doyin Pumps Kenya. Explore specifications, stock status, and product details.';

  return (
    <div className="container products-page">
      <Seo title={productsTitle} description={productsDescription} path="/products" />

      <section className="products-hero">
        <div className="eyebrow">Catalog</div>
        <h1>Explore the full product collection.</h1>
        <p className="section-copy">
          Browse pumps, accessories, and related equipment with clearer filters, sharper cards, and a more premium browsing flow.
        </p>
      </section>

      <div className="products-toolbar">
        <Search size={18} color="var(--clr-text-muted)" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, category, or specification"
        />
        <button type="button" className="btn btn-primary">
          Search
        </button>
      </div>

      <div className="products-filters">
        <div className="products-filters-header">
          <SlidersHorizontal size={18} color="var(--clr-brand-primary)" />
          <strong>Filter Products</strong>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ marginLeft: 'auto', padding: '0.55rem 1rem' }}
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

        <div className="products-filters-grid">
          <div>
            <label className="products-select-label">View By</label>
            <select value={selectedView} onChange={(e) => setSelectedView(e.target.value)}>
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="products-select-label">Category</label>
            <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="products-summary">
            <div className="products-summary-box">
              Showing <strong style={{ color: 'var(--clr-text-main)' }}>{filtered.length}</strong> of{' '}
              <strong style={{ color: 'var(--clr-text-main)' }}>{products.length}</strong> products
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="products-empty">
          <Droplets size={32} style={{ animation: 'pulse 1.5s infinite' }} />
          <p style={{ marginTop: '1rem' }}>Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="products-empty">
          <Package size={48} color="var(--clr-border)" />
          <p style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>
            {hasActiveFilters ? 'No products matched your current search and filter combination.' : 'No products available yet. Check back soon.'}
          </p>
          {hasActiveFilters && (
            <a
              href={`https://wa.me/254742167151?text=${encodeURIComponent(`Hi, I could not find the product I need. Search: "${searchTerm.trim() || 'none'}". Please assist me.`)}`}
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} /> Contact Sales
            </a>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((product) => (
            <div key={product.id} className="card product-card">
              <div className="product-card-media">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" />
                ) : (
                  <Droplets size={48} color="var(--clr-border)" />
                )}
              </div>

              <div className="product-card-body">
                {product.category && (
                  <span className="product-card-badge">{product.category.name}</span>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{product.name}</h3>
                  <span className={`product-stock-badge ${product.in_stock ? 'in-stock' : 'out-stock'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {product.description && (
                  <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.92rem', margin: 0, lineHeight: 1.7 }}>
                    {product.description}
                  </p>
                )}

                <div className="product-card-specs">
                  {product.max_flow_rate && (
                    <div className="product-card-spec">
                      <span>Flow Rate</span>
                      <strong>{product.max_flow_rate}</strong>
                    </div>
                  )}
                  {product.max_height && (
                    <div className="product-card-spec">
                      <span>Max Height</span>
                      <strong>{product.max_height}</strong>
                    </div>
                  )}
                  {product.recommended_depth && (
                    <div className="product-card-spec">
                      <span>Depth</span>
                      <strong>{product.recommended_depth}</strong>
                    </div>
                  )}
                  {product.ideal_power && (
                    <div className="product-card-spec power">
                      <span>Ideal Power</span>
                      <strong>{product.ideal_power}</strong>
                    </div>
                  )}
                </div>

                <Link to={`/products/${product.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
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
