import { useState, useMemo } from 'react';
import { Package, Droplets, Search, MessageCircle, SlidersHorizontal, X, Zap, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import { getThumbnailUrl } from '../utils/imageTransforms';
import Seo from '../components/Seo';
import './Products.css';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Products' },
  { value: 'pump', label: 'Pump Types' },
  { value: 'other', label: 'Accessories and Other' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'with-price', label: 'Has Price' },
  { value: 'without-price', label: 'No Price Listed' },
  { value: 'with-flow-rate', label: 'With Flow Rate' },
  { value: 'with-height', label: 'With Max Height' },
  { value: 'with-depth', label: 'With Recommended Depth' },
  { value: 'with-ideal-power', label: 'With Ideal Power' },
];

const POWER_RATINGS = ['0.5HP', '1.0HP', '1.5HP', '2.0HP', '3.0HP', '5.0HP', '7.5HP', '10HP', '15HP', '20HP'];

const matchesViewFilter = (product, selectedView) => {
  switch (selectedView) {
    case 'pump': return product.category?.is_pump ?? true;
    case 'other': return !(product.category?.is_pump ?? true);
    case 'in-stock': return Boolean(product.in_stock);
    case 'with-price': return product.price != null;
    case 'without-price': return product.price == null;
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
  const [selectedPowerRatings, setSelectedPowerRatings] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  const filtered = useMemo(() => {
    return categoryFiltered
      .filter((product) => matchesViewFilter(product, selectedView))
      .filter((product) => {
        if (inStockOnly && !product.in_stock) return false;
        if (selectedPowerRatings.length > 0) {
          const power = (product.ideal_power || '').toLowerCase();
          if (!selectedPowerRatings.some((r) => power.includes(r.toLowerCase()))) return false;
        }
        if (product.price != null) {
          const price = Number(product.price);
          if (price < priceRange[0] || price > priceRange[1]) return false;
        }
        if (!normalizedQuery) return true;
        const haystack = [
          product.name,
          product.description,
          product.category?.name,
          product.max_flow_rate,
          product.max_height,
          product.recommended_depth,
          product.ideal_power,
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(normalizedQuery);
      });
  }, [categoryFiltered, selectedView, inStockOnly, selectedPowerRatings, priceRange, normalizedQuery]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedView !== 'all' || normalizedQuery || inStockOnly || selectedPowerRatings.length > 0 || priceRange[1] < 500000;
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
          <button
            type="button"
            className="btn btn-outline"
            style={{ marginLeft: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <><X size={14} /> Hide Filters</> : <><SlidersHorizontal size={14} /> Advanced Filters</>}
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              onClick={() => {
                setSelectedView('all');
                setSearchTerm('');
                setSelectedPowerRatings([]);
                setPriceRange([0, 500000]);
                setInStockOnly(false);
                handleCategoryChange('all');
              }}
            >
              Reset All
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

        {showFilters && (
          <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'var(--clr-bg-page)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--clr-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {/* In Stock Only Toggle */}
              <div>
                <label className="products-select-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Availability</label>
                <button
                  type="button"
                  onClick={() => setInStockOnly(!inStockOnly)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem',
                    border: inStockOnly ? '1.5px solid var(--clr-brand-secondary)' : '1.5px solid var(--clr-border)',
                    borderRadius: 'var(--radius-full)', background: inStockOnly ? 'rgba(0, 212, 255, 0.08)' : 'white',
                    cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: inStockOnly ? '#10b981' : '#cbd5e1', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: '2px', left: inStockOnly ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                  In Stock Only
                </button>
              </div>

              {/* Power Rating Tags */}
              <div>
                <label className="products-select-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Ideal Power</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {POWER_RATINGS.map((rating) => {
                    const active = selectedPowerRatings.includes(rating);
                    return (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => {
                          setSelectedPowerRatings((prev) =>
                            active ? prev.filter((r) => r !== rating) : [...prev, rating]
                          );
                        }}
                        style={{
                          padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem',
                          fontWeight: 600, border: active ? '1.5px solid var(--clr-brand-primary)' : '1px solid var(--clr-border)',
                          background: active ? 'rgba(2, 101, 192, 0.08)' : 'white',
                          color: active ? 'var(--clr-brand-primary)' : 'var(--clr-text-muted)',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        <Zap size={10} style={{ marginRight: '2px' }} />{rating}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="products-select-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Max Price: KES {priceRange[1].toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  style={{ width: '100%', accentColor: 'var(--clr-brand-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>
                  <span>KES 0</span>
                  <span>KES 500,000</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="products-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(90deg, var(--clr-surface-metallic) 25%, rgba(255,255,255,0.6) 50%, var(--clr-surface-metallic) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ height: '1.4rem', width: '5rem', borderRadius: '4px', background: 'linear-gradient(90deg, var(--clr-surface-metallic) 25%, rgba(255,255,255,0.6) 50%, var(--clr-surface-metallic) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                <div style={{ height: '1.3rem', width: '70%', borderRadius: '4px', background: 'linear-gradient(90deg, var(--clr-surface-metallic) 25%, rgba(255,255,255,0.6) 50%, var(--clr-surface-metallic) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                <div style={{ height: '0.8rem', width: '90%', borderRadius: '4px', background: 'linear-gradient(90deg, var(--clr-surface-metallic) 25%, rgba(255,255,255,0.6) 50%, var(--clr-surface-metallic) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
              </div>
            </div>
          ))}
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
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="card product-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="product-card-media">
                {product.image_url ? (
                  <img src={getThumbnailUrl(product.image_url)} alt={product.name} loading="lazy" decoding="async" />
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
                  <p className="product-card-description">
                    {product.description}
                  </p>
                )}

                <div className="product-card-specs">
                  {product.price != null && (
                    <div className="product-card-spec" style={{ gridColumn: '1 / -1', background: 'rgba(2, 101, 192, 0.06)' }}>
                      <span>Price</span>
                      <strong style={{ fontSize: '1rem' }}>KES {Number(product.price).toLocaleString()}</strong>
                    </div>
                  )}
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

                <div className="product-card-viewmore">
                  <span>View full details & specs</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
