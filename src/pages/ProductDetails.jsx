import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Droplets, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';
import { getCachedPublicCatalog } from '../hooks/usePublicCatalog';
import EnquiryModal from '../components/EnquiryModal';
import Seo from '../components/Seo';

const trimDescription = (value, maxLength = 160) => {
  if (!value) return '';
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
};

const ProductDetails = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const initialCachedProduct = getCachedPublicCatalog()?.products?.find((item) => item.id === numericId) || null;
  const [product, setProduct] = useState(initialCachedProduct);
  const [loading, setLoading] = useState(!initialCachedProduct);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    const cachedProduct = getCachedPublicCatalog()?.products?.find((item) => item.id === numericId);
    if (cachedProduct) {
      setProduct(cachedProduct);
      setLoading(false);
    }
  }, [numericId]);

  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/public/products/${id}`);
        if (!cancelled) setProduct(response.data);
      } catch (error) {
        if (!cancelled) { console.error('Failed to load product', error); setProduct(null); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (!getCachedPublicCatalog()?.products?.find((item) => item.id === numericId)) fetchProduct();
    return () => { cancelled = true; };
  }, [id, numericId]);

  if (loading) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Seo
          title="Loading Product | Doyin Pumps Kenya"
          description="Loading product information from Doyin Pumps Kenya."
          path={`/products/${id}`}
        />
        <Droplets size={48} style={{ animation: 'pulse 1.5s infinite', color: 'var(--clr-brand-secondary)' }} />
        <p style={{ marginTop: '1rem', color: 'var(--clr-text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <Seo
          title="Product Not Found | Doyin Pumps Kenya"
          description="The requested Doyin Pumps Kenya product could not be found."
          path={`/products/${id}`}
          noindex
        />
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--clr-text-muted)' }}>The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Back to Products</Link>
      </div>
    );
  }

  const isPumpCategory = product.category?.is_pump ?? true;
  const hasSpecifications = Boolean(product.max_flow_rate || product.max_height || product.recommended_depth || product.ideal_power);
  const productTitle = `${product.name} | Doyin Pumps Kenya`;
  const productDescription = trimDescription(
    product.description
      || `${product.name} from Doyin Pumps Kenya. Explore specifications, availability, and enquiry options for this product.`
  );

  return (
    <div className="container section-padding">
      <Seo
        title={productTitle}
        description={productDescription}
        path={`/products/${product.id}`}
        type="product"
        image={product.image_url || '/images/logo.jpg'}
      />
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--clr-text-muted)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 500 }}>
        <ArrowLeft size={18} /> Back to Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        {/* Image — uses aspect-ratio for responsive sizing */}
        <div style={{ background: 'var(--clr-surface-metallic)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3', border: '1px solid var(--clr-border)', position: 'relative' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} decoding="async" />
          ) : (
            <Droplets size={80} color="var(--clr-border)" />
          )}
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
            {product.category && (
              <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.9)', color: 'var(--clr-brand-primary)', boxShadow: 'var(--shadow-sm)' }}>
                {product.category.name}
              </span>
            )}
            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', background: product.in_stock ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', color: 'white', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {product.in_stock ? <><CheckCircle2 size={14} /> IN STOCK</> : <><XCircle size={14} /> OUT OF STOCK</>}
            </span>
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1rem', color: 'var(--clr-text-main)', lineHeight: 1.2 }}>
            {product.name}
          </h1>
          <div style={{ color: 'var(--clr-text-primary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', whiteSpace: 'pre-wrap' }}>
            {product.description || 'Detailed description coming soon.'}
          </div>

          {isPumpCategory && (
            <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2.5rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--clr-text-main)' }}>Technical Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                {product.max_flow_rate && (
                  <div><span style={{ display: 'block', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Maximum Flow Rate</span><strong style={{ fontSize: '1.1rem' }}>{product.max_flow_rate}</strong></div>
                )}
                {product.max_height && (
                  <div><span style={{ display: 'block', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Max Pumping Height</span><strong style={{ fontSize: '1.1rem' }}>{product.max_height}</strong></div>
                )}
                {product.recommended_depth && (
                  <div><span style={{ display: 'block', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Recommended Depth</span><strong style={{ fontSize: '1.1rem' }}>{product.recommended_depth}</strong></div>
                )}
                {product.ideal_power && (
                  <div><span style={{ display: 'block', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Ideal Power</span><strong style={{ fontSize: '1.1rem', color: '#92400e' }}>{product.ideal_power}</strong></div>
                )}
              </div>
              {!hasSpecifications && <p style={{ margin: 0, color: 'var(--clr-text-muted)', fontStyle: 'italic' }}>Specifications are not listed for this model.</p>}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-outline"
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.1rem' }}
              onClick={() => setShowEnquiry(true)}
            >
              Inquire Now <ArrowRight size={20} />
            </button>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
            Choose a sales rep and connect via WhatsApp instantly.
          </p>
        </div>
      </div>

      {showEnquiry && <EnquiryModal product={product} onClose={() => setShowEnquiry(false)} />}
    </div>
  );
};

export default ProductDetails;
