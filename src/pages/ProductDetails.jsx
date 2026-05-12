import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Droplets, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';
import { getCachedPublicCatalog } from '../hooks/usePublicCatalog';
import EnquiryModal from '../components/EnquiryModal';
import Seo from '../components/Seo';
import './ProductDetails.css';

const buildViewSessionKey = (productId) => `product_view_recorded_${productId}`;

const trimDescription = (value, maxLength = 160) => {
  if (!value) return '';

  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength - 3).trim()}...`;
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
        if (!cancelled) {
          console.error('Failed to load product', error);
          setProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (!getCachedPublicCatalog()?.products?.find((item) => item.id === numericId)) {
      fetchProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [id, numericId]);

  useEffect(() => {
    if (!product?.id) return;

    const sessionKey = buildViewSessionKey(product.id);

    try {
      if (sessionStorage.getItem(sessionKey)) {
        return;
      }
    } catch {
      // Ignore storage access issues and still attempt to record the view.
    }

    api.post(`/public/products/${product.id}/view`).then(() => {
      try {
        sessionStorage.setItem(sessionKey, '1');
      } catch {
        // Ignore storage access issues after a successful view record.
      }
    }).catch(() => {});
  }, [product?.id]);

  if (loading) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Seo title="Loading Product | Doyin Pumps Kenya" description="Loading product information from Doyin Pumps Kenya." path={`/products/${id}`} />
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
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Products
        </Link>
      </div>
    );
  }

  const isPumpCategory = product.category?.is_pump ?? true;
  const hasSpecifications = Boolean(product.max_flow_rate || product.max_height || product.recommended_depth || product.ideal_power);
  const productTitle = `${product.name} | Doyin Pumps Kenya`;
  const productDescription = trimDescription(
    product.description || `${product.name} from Doyin Pumps Kenya. Explore specifications, availability, and enquiry options for this product.`
  );

  return (
    <div className="container product-detail-page">
      <Seo
        title={productTitle}
        description={productDescription}
        path={`/products/${product.id}`}
        type="product"
        image={product.image_url || '/images/logo.jpg'}
      />

      <Link to="/products" className="product-detail-back">
        <ArrowLeft size={18} /> Back to Catalog
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-media">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} decoding="async" />
          ) : (
            <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
              <Droplets size={80} color="var(--clr-border)" />
            </div>
          )}

          <div className="product-detail-overlay">
            {product.category && (
              <span className="product-pill category">{product.category.name}</span>
            )}
            <span className={`product-pill stock ${product.in_stock ? 'in-stock' : 'out-stock'}`}>
              {product.in_stock ? <><CheckCircle2 size={14} /> In Stock</> : <><XCircle size={14} /> Out of Stock</>}
            </span>
          </div>
        </div>

        <div className="product-detail-copy">
          <div>
            <div className="eyebrow">Product Detail</div>
            <h1>{product.name}</h1>
          </div>

          <div className="product-detail-description">
            {product.description || 'Detailed description coming soon.'}
          </div>

          {isPumpCategory && (
            <div className="card product-detail-specs">
              <h3 style={{ marginTop: 0, marginBottom: '1.2rem' }}>Technical Specifications</h3>
              <div className="product-detail-spec-grid">
                {product.max_flow_rate && (
                  <div className="product-detail-spec">
                    <span>Maximum Flow Rate</span>
                    <strong>{product.max_flow_rate}</strong>
                  </div>
                )}
                {product.max_height && (
                  <div className="product-detail-spec">
                    <span>Max Pumping Height</span>
                    <strong>{product.max_height}</strong>
                  </div>
                )}
                {product.recommended_depth && (
                  <div className="product-detail-spec">
                    <span>Recommended Depth</span>
                    <strong>{product.recommended_depth}</strong>
                  </div>
                )}
                {product.ideal_power && (
                  <div className="product-detail-spec">
                    <span>Ideal Power</span>
                    <strong>{product.ideal_power}</strong>
                  </div>
                )}
              </div>
              {!hasSpecifications && (
                <p style={{ margin: '1rem 0 0', color: 'var(--clr-text-muted)', fontStyle: 'italic' }}>
                  Specifications are not listed for this model.
                </p>
              )}
            </div>
          )}

          <div className="product-detail-actions">
            <button
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: 'center', padding: '1rem' }}
              onClick={() => setShowEnquiry(true)}
            >
              Inquire Now <ArrowRight size={20} />
            </button>
          </div>
          <p className="product-detail-note">Choose a sales rep and connect via WhatsApp instantly.</p>
        </div>
      </div>

      {showEnquiry && <EnquiryModal product={product} onClose={() => setShowEnquiry(false)} />}
    </div>
  );
};

export default ProductDetails;
