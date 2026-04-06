import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Droplets, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';
import { getCachedPublicCatalog } from '../hooks/usePublicCatalog';

const ProductDetails = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const initialCachedProduct = getCachedPublicCatalog()?.products?.find((item) => item.id === numericId) || null;
  const [product, setProduct] = useState(initialCachedProduct);
  const [loading, setLoading] = useState(!initialCachedProduct);

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
        if (!cancelled) {
          setProduct(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load product', error);
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (!getCachedPublicCatalog()?.products?.find((item) => item.id === numericId)) {
      fetchProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [id, numericId]);

  if (loading) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Droplets size={48} style={{ animation: 'pulse 1.5s infinite', color: 'var(--clr-brand-secondary)' }} />
        <p style={{ marginTop: '1rem', color: 'var(--clr-text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--clr-text-muted)' }}>The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Back to Products</Link>
      </div>
    );
  }

  const isPumpCategory = product.category?.is_pump ?? true;
  const hasSpecifications = Boolean(product.max_flow_rate || product.max_height || product.recommended_depth || product.ideal_power);

  return (
    <div className="container section-padding">
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--clr-text-muted)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 500 }}>
        <ArrowLeft size={18} /> Back to Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        <div style={{ background: 'var(--clr-surface-metallic)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', border: '1px solid var(--clr-border)', position: 'relative' }}>
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--clr-text-main)', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          <div style={{ color: 'var(--clr-text-primary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', whiteSpace: 'pre-wrap' }}>
            {product.description || 'Detailed description coming soon.'}
          </div>

          {isPumpCategory && (
            <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2.5rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--clr-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Technical Specifications
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {product.max_flow_rate && (
                  <div>
                    <span style={{ display: 'block', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Maximum Flow Rate</span>
                    <strong style={{ fontSize: '1.1rem' }}>{product.max_flow_rate}</strong>
                  </div>
                )}
                {product.max_height && (
                  <div>
                    <span style={{ display: 'block', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Max Pumping Height</span>
                    <strong style={{ fontSize: '1.1rem' }}>{product.max_height}</strong>
                  </div>
                )}
                {product.recommended_depth && (
                  <div>
                    <span style={{ display: 'block', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Recommended Depth</span>
                    <strong style={{ fontSize: '1.1rem' }}>{product.recommended_depth}</strong>
                  </div>
                )}
                {product.ideal_power && (
                  <div>
                    <span style={{ display: 'block', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Ideal Power</span>
                    <strong style={{ fontSize: '1.1rem', color: '#92400e' }}>{product.ideal_power}</strong>
                  </div>
                )}
              </div>

              {!hasSpecifications && (
                <p style={{ margin: 0, color: 'var(--clr-text-muted)', fontStyle: 'italic' }}>Specifications are not listed for this model.</p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <a
              href={`https://wa.me/254742167151?text=Hi, I'm analyzing the ${encodeURIComponent(product.name)}. Please assist me with pricing and availability.`}
              className="btn btn-outline"
              style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => api.post(`/public/products/${product.id}/view`).catch(() => {})}
            >
              Inquire Now <ArrowRight size={20} />
            </a>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
            Clicking will seamlessly redirect you to a WhatsApp chat with our sales team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
