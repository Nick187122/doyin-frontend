import { ArrowRight, Waves, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePublicSite } from '../context/PublicSiteContext';
import { API_ORIGIN } from '../services/api';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import './Home.css';

// Pump category icon map — maps keyword in name to an emoji
const categoryEmoji = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('submersible')) return '🌊';
  if (n.includes('solar')) return '☀️';
  if (n.includes('surface') || n.includes('centrifugal')) return '⚙️';
  if (n.includes('deep')) return '🕳️';
  if (n.includes('borehole')) return '🔩';
  if (n.includes('agriculture') || n.includes('irrigation')) return '🌿';
  if (n.includes('industrial')) return '🏭';
  if (n.includes('domestic') || n.includes('home')) return '🏠';
  if (n.includes('accessories')) return '🔧';
  return '💧';
};

const Home = () => {
  const { heroImages } = usePublicSite();
  const { categories } = usePublicCatalog();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Powering Kenya's <span className="highlight">Water Future</span>
            </h1>
            <p className="hero-subtitle">
              High-performance submersible water pumps engineered for durability and efficiency. Whether for deep wells, agriculture, or industrial applications.
            </p>
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
                  <button onClick={prevSlide} className="carousel-btn"><ChevronLeft size={24} /></button>
                  <button onClick={nextSlide} className="carousel-btn"><ChevronRight size={24} /></button>
                </div>
                {heroImages[currentIndex].title && (
                  <div className="carousel-caption">{heroImages[currentIndex].title}</div>
                )}
                <div className="carousel-indicators">
                  {heroImages.map((img, idx) => (
                    <span key={img.id} className={`indicator ${idx === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(idx)} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="visual-circle">
                <Waves size={80} className="visual-icon" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured section-padding">
        <div className="container">
          <h2 className="text-center">Engineered for Excellence</h2>
          <div className="features-grid">
            <div className="card text-center">
              <h3>High Efficiency</h3>
              <p>Optimum performance with low energy consumption.</p>
            </div>
            <div className="card text-center">
              <h3>Durable Build</h3>
              <p>Stainless steel components resistant to corrosion.</p>
            </div>
            <div className="card text-center">
              <h3>Deep Well Ready</h3>
              <p>Designed to operate at extreme depths reliably.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section style={{ background: 'var(--clr-surface-light)', padding: '5rem 0', borderTop: '1px solid var(--clr-border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '0.75rem' }}>Browse by Category</h2>
              <p style={{ color: 'var(--clr-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                We carry a wide range of pump types and accessories to suit every application. Click a category to explore its products.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1.25rem',
            }}>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--clr-surface)',
                    border: '1px solid var(--clr-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = 'var(--clr-brand-primary)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--clr-border)';
                  }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', lineHeight: 1 }}>
                      {categoryEmoji(cat.name)}
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--clr-text-main)', fontWeight: 600, lineHeight: 1.4 }}>
                      {cat.name}
                    </h4>
                    {cat.description && (
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--clr-text-muted)', lineHeight: 1.5 }}>
                        {cat.description}
                      </p>
                    )}
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-brand-primary)' }}>
                      View Products <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/products" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={18} /> View All Products
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
