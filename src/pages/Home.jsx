import { ArrowRight, Waves, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePublicSite } from '../context/PublicSiteContext';
import { API_ORIGIN } from '../services/api';
import './Home.css';

const Home = () => {
  const { heroImages } = usePublicSite();
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
                  <div className="carousel-caption">
                    {heroImages[currentIndex].title}
                  </div>
                )}
                <div className="carousel-indicators">
                  {heroImages.map((img, idx) => (
                    <span 
                      key={img.id} 
                      className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                    />
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

      {/* Featured Section placeholder */}
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
    </div>
  );
};

export default Home;
