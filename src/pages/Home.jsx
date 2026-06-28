import {
  ArrowRight,
  Waves,
  ChevronLeft,
  ChevronRight,
  Droplets,
  SunMedium,
  Cog,
  Factory,
  Home as HomeIcon,
  Wrench,
  Sprout,
  ShieldCheck,
  Gauge,
  Sparkles,
  Clock3,
  CircleCheck,
  TrendingUp,
  Eye,
  Star,
  Quote,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePublicSite } from '../context/PublicSiteContext';
import { API_ORIGIN } from '../services/api';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import Seo from '../components/Seo';
import './Home.css';

const categoryIcon = (name = '') => {
  const normalized = name.toLowerCase();

  if (normalized.includes('submersible') || normalized.includes('borehole')) return Waves;
  if (normalized.includes('solar')) return SunMedium;
  if (normalized.includes('surface') || normalized.includes('centrifugal')) return Cog;
  if (normalized.includes('agriculture') || normalized.includes('irrigation')) return Sprout;
  if (normalized.includes('industrial')) return Factory;
  if (normalized.includes('domestic') || normalized.includes('home')) return HomeIcon;
  if (normalized.includes('accessories')) return Wrench;

  return Droplets;
};

const Home = () => {
  const { heroImages, settings, testimonials } = usePublicSite();
  const { categories, products } = usePublicCatalog();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length === 0) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  const newArrivalsEnabled = settings.homepage_new_arrivals_enabled !== '0';
  const newArrivalsCount = Math.min(Math.max(Number(settings.homepage_new_arrivals_count) || 4, 1), 12);
  const newArrivalsCategoryId = settings.homepage_new_arrivals_category_id
    ? String(settings.homepage_new_arrivals_category_id)
    : '';
  const featuredProductsEnabled = settings.homepage_featured_products_enabled !== '0';
  const featuredProductIds = String(settings.homepage_featured_product_ids || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const productsById = products.reduce((accumulator, product) => {
    accumulator[String(product.id)] = product;
    return accumulator;
  }, {});
  const categoryPreviewMap = categories.reduce((accumulator, category) => {
    accumulator[category.id] = products
      .filter((product) => String(product.category_id) === String(category.id))
      .sort((left, right) => right.id - left.id)
      .slice(0, 3);

    return accumulator;
  }, {});

  const newArrivals = products
    .filter((product) => !newArrivalsCategoryId || String(product.category_id) === newArrivalsCategoryId)
    .sort((left, right) => {
      const leftDate = new Date(left.created_at || 0).getTime();
      const rightDate = new Date(right.created_at || 0).getTime();

      if (leftDate !== rightDate) {
        return rightDate - leftDate;
      }

      return right.id - left.id;
    })
    .slice(0, newArrivalsCount);
  const featuredProducts = featuredProductIds
    .map((id) => productsById[id])
    .filter(Boolean)
    .slice(0, 6);
  const popularProducts = [...products]
    .filter((product) => Boolean(product.in_stock) && Number(product.views_count) > 0)
    .sort((left, right) => {
      const leftViews = Number(left.views_count) || 0;
      const rightViews = Number(right.views_count) || 0;

      if (leftViews !== rightViews) {
        return rightViews - leftViews;
      }

      return right.id - left.id;
    })
    .slice(0, 3);

  return (
    <div className="home-page">
      <Seo
        title="Doyin Pumps Kenya | Submersible Water Pumps and Borehole Pump Solutions"
        description="Doyin Pumps Kenya supplies high-performance submersible water pumps, borehole pumps, solar pump systems, and industrial fluid solutions across Kenya."
        path="/"
      />

      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="eyebrow">Premium Fluid Systems</div>
            <h1 className="hero-title">Water infrastructure, presented with more precision.</h1>
            <p className="hero-subtitle">
              High-performance submersible pumps, borehole systems, and industrial water solutions curated for demanding projects across Kenya.
            </p>

            <div className="hero-metrics">
              <div>
                <strong>{categories.length || 8}+</strong>
                <span>categories ready for specification</span>
              </div>
              <div>
                <strong>Fast</strong>
                <span>sales response on WhatsApp</span>
              </div>
              <div>
                <strong>Built</strong>
                <span>for agricultural and industrial duty</span>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                View Catalog <ArrowRight size={20} />
              </Link>
              <a href="https://wa.me/254742167151" className="btn btn-outline">
                Contact Sales
              </a>
            </div>
          </div>

          <div className="hero-visual">
            {heroImages.length > 0 ? (
              <div className="carousel-container">
                <img
                  src={`${API_ORIGIN}${heroImages[currentIndex].image_path}`}
                  alt={heroImages[currentIndex].title || 'Hero image'}
                  className="carousel-image"
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="carousel-controls">
                  <button onClick={prevSlide} className="carousel-btn" aria-label="Previous hero image">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextSlide} className="carousel-btn" aria-label="Next hero image">
                    <ChevronRight size={24} />
                  </button>
                </div>
                {heroImages[currentIndex].title && (
                  <div className="carousel-caption">{heroImages[currentIndex].title}</div>
                )}
                <div className="carousel-indicators">
                  {heroImages.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                      aria-label={`Show hero image ${idx + 1}`}
                      onClick={() => setCurrentIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="visual-panel">
                <div className="visual-panel-mark">
                  <Waves size={68} className="visual-icon" />
                </div>
                <p>Purpose-built pumping systems for deep wells, farms, and commercial water movement.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="featured section-padding">
        <div className="container">
          <div className="home-section-heading text-center">
            <div className="eyebrow">Why Doyin</div>
            <h2>Engineered for reliable long-term duty.</h2>
            <p className="section-copy home-section-copy">
              The storefront now reflects the quality expected from premium technical products: measured, polished, and built around confidence.
            </p>
          </div>

          <div className="features-grid">
            <div className="card feature-card">
              <ShieldCheck size={26} />
              <h3>High Efficiency</h3>
              <p>Optimum performance with low energy consumption.</p>
            </div>
            <div className="card feature-card">
              <Gauge size={26} />
              <h3>Durable Build</h3>
              <p>Stainless steel components resistant to corrosion.</p>
            </div>
            <div className="card feature-card">
              <Sparkles size={26} />
              <h3>Deep Well Ready</h3>
              <p>Designed to operate at extreme depths reliably.</p>
            </div>
          </div>
        </div>
      </section>

      {newArrivalsEnabled && newArrivals.length > 0 && (
        <section className="home-new-arrivals section-padding">
          <div className="container">
            <div className="home-new-arrivals-head">
              <div>
                <div className="eyebrow">{settings.homepage_new_arrivals_badge || 'New Arrivals'}</div>
                <h2>{settings.homepage_new_arrivals_title || 'Fresh stock ready for specification.'}</h2>
                <p className="section-copy">
                  {settings.homepage_new_arrivals_copy || 'Discover the latest additions to the catalog, with current stock status and fast paths to enquiry.'}
                </p>
              </div>
              <Link to="/products" className="btn btn-outline">
                Browse Catalog <ArrowRight size={18} />
              </Link>
            </div>

            <div className="new-arrivals-grid">
              {newArrivals.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="new-arrival-card">
                  <div className="new-arrival-media">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" />
                    ) : (
                      <div className="new-arrival-fallback">
                        <Droplets size={36} />
                      </div>
                    )}
                    <div className="new-arrival-overlay">
                      <span className="new-arrival-chip">
                        <Clock3 size={14} /> Latest
                      </span>
                      <span className={`new-arrival-chip stock ${product.in_stock ? 'in-stock' : 'out-stock'}`}>
                        <CircleCheck size={14} /> {product.in_stock ? 'In Stock' : 'Ask Availability'}
                      </span>
                    </div>
                  </div>

                  <div className="new-arrival-body">
                    {product.category && <span className="new-arrival-category">{product.category.name}</span>}
                    <h3>{product.name}</h3>
                    <p>{product.description || 'Open this product to see specifications, details, and direct enquiry options.'}</p>
                    <div className="new-arrival-meta">
                      {product.max_flow_rate && <span>Flow: {product.max_flow_rate}</span>}
                      {product.max_height && <span>Head: {product.max_height}</span>}
                      {product.ideal_power && <span>Power: {product.ideal_power}</span>}
                    </div>
                    <div className="new-arrival-link">
                      View Product <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredProductsEnabled && featuredProducts.length > 0 && (
        <section className="home-featured-products section-padding">
          <div className="container">
            <div className="home-featured-head">
              <div>
                <div className="eyebrow">{settings.homepage_featured_products_badge || 'Featured Products'}</div>
                <h2>{settings.homepage_featured_products_title || 'Priority models we want customers to see first.'}</h2>
                <p className="section-copy">
                  {settings.homepage_featured_products_copy || 'Hand-picked products from the catalog, curated manually from admin for stronger homepage merchandising.'}
                </p>
              </div>
              <Link to="/products" className="btn btn-outline">
                Browse Catalog <ArrowRight size={18} />
              </Link>
            </div>

            <div className="featured-products-grid">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="featured-product-card">
                  <div className="featured-product-media">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" />
                    ) : (
                      <div className="featured-product-fallback">
                        <Droplets size={34} />
                      </div>
                    )}
                  </div>

                  <div className="featured-product-body">
                    {product.category && <span className="featured-product-category">{product.category.name}</span>}
                    <div className="featured-product-title-row">
                      <h3>{product.name}</h3>
                      <span className={`featured-product-stock ${product.in_stock ? 'in-stock' : 'out-stock'}`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <p>{product.description || 'Open the product to review details, specifications, and enquiry options.'}</p>
                    <div className="featured-product-meta">
                      {product.max_flow_rate && <span>Flow: {product.max_flow_rate}</span>}
                      {product.max_height && <span>Head: {product.max_height}</span>}
                      {product.ideal_power && <span>Power: {product.ideal_power}</span>}
                    </div>
                    <div className="featured-product-link">
                      View Product <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="home-categories">
          <div className="container">
            <div className="home-section-heading text-center">
              <div className="eyebrow">Catalog Structure</div>
              <h2>Browse by category.</h2>
              <p className="section-copy home-section-copy">
                Move through the main product families and preview live items before entering the full catalog.
              </p>
            </div>

            <div className="category-grid">
              {categories.map((cat) => {
                const Icon = categoryIcon(cat.name);
                const previewProducts = categoryPreviewMap[cat.id] || [];

                return (
                  <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-card">
                    <div className="category-card-topline">
                      <div className="category-icon">
                        <Icon size={24} />
                      </div>
                      <span className="category-preview-count">
                        {previewProducts.length} live {previewProducts.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <h4>{cat.name}</h4>
                    {cat.description && <p>{cat.description}</p>}
                    <div className="category-hover-panel" aria-hidden="true">
                      {previewProducts.length > 0 ? (
                        previewProducts.map((product) => (
                          <div key={product.id} className="category-hover-item">
                            <div className="category-hover-thumb">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" />
                              ) : (
                                <Droplets size={18} />
                              )}
                            </div>
                            <div className="category-hover-copy">
                              <strong>{product.name}</strong>
                              <span>{product.in_stock ? 'In stock' : 'Available on request'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="category-hover-empty">
                          Products in this category will appear here as soon as they are added.
                        </div>
                      )}
                    </div>
                    <div className="category-link">
                      View Products <ArrowRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="home-bottom-cta">
              <Link to="/products" className="btn btn-outline">
                <Droplets size={18} /> View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="home-testimonials section-padding">
          <div className="container">
            <div className="home-section-heading text-center">
              <div className="eyebrow">Testimonials</div>
              <h2>What our clients say.</h2>
              <p className="section-copy home-section-copy">
                Real feedback from customers who trust our pump systems for their water infrastructure.
              </p>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="card testimonial-card">
                  <div className="testimonial-stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < (testimonial.rating || 5) ? '#f59e0b' : 'none'}
                        color={i < (testimonial.rating || 5) ? '#f59e0b' : '#d1d5db'}
                      />
                    ))}
                  </div>
                  {testimonial.video_url && (
                    <div className="testimonial-video">
                      <video src={testimonial.video_url} controls preload="metadata" style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
                    </div>
                  )}
                  <div className="testimonial-quote">
                    <Quote size={20} className="testimonial-quote-icon" />
                    <p>&ldquo;{testimonial.content}&rdquo;</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      {testimonial.avatar_url ? (
                        <img src={testimonial.avatar_url} alt={testimonial.name} loading="lazy" decoding="async" />
                      ) : (
                        <div className="testimonial-avatar-fallback">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="testimonial-author-info">
                      <strong>{testimonial.name}</strong>
                      {(testimonial.title || testimonial.company) && (
                        <span>{[testimonial.title, testimonial.company].filter(Boolean).join(' · ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {popularProducts.length > 0 && (
        <section className="home-popular section-padding">
          <div className="container">
            <div className="home-popular-head">
              <div>
                <div className="eyebrow">Popular Products</div>
                <h2>What customers are viewing most.</h2>
                <p className="section-copy">
                  This section updates automatically from actual product visits, keeping the homepage useful without turning it into noise.
                </p>
              </div>
              <Link to="/products" className="btn btn-outline">
                View All Products <ArrowRight size={18} />
              </Link>
            </div>

            <div className="popular-products-grid">
              {popularProducts.map((product, index) => (
                <Link key={product.id} to={`/products/${product.id}`} className="popular-product-card">
                  <div className="popular-product-rank">
                    <span>0{index + 1}</span>
                    <TrendingUp size={18} />
                  </div>

                  <div className="popular-product-main">
                    <div className="popular-product-copy">
                      {product.category && <span className="popular-product-category">{product.category.name}</span>}
                      <h3>{product.name}</h3>
                      <p>{product.description || 'Open this product to review specifications and enquire directly.'}</p>
                    </div>

                    <div className="popular-product-side">
                      <div className="popular-product-views">
                        <Eye size={16} />
                        <strong>{Number(product.views_count) || 0}</strong>
                        <span>views</span>
                      </div>
                      <div className={`popular-product-stock ${product.in_stock ? 'in-stock' : 'out-stock'}`}>
                        {product.in_stock ? 'In Stock' : 'Ask Availability'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
