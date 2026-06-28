import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import api, { API_ORIGIN } from '../../services/api';
import AdminPasswordChangePanel from '../../components/admin/AdminPasswordChangePanel';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    store_name: 'Doyin Pumps Kenya',
    contact_email: 'admin@doyinkenya.com',
    contact_phone: '+254 742 167 151',
    contact_address: 'Nairobi, Kenya',
    facebook_url: '',
    instagram_url: '',
    about_video_url: '',
    homepage_new_arrivals_enabled: '1',
    homepage_new_arrivals_badge: 'New Arrivals',
    homepage_new_arrivals_title: 'Fresh stock ready for specification.',
    homepage_new_arrivals_copy: 'Discover the latest additions to the catalog, with current stock status and fast paths to enquiry.',
    homepage_new_arrivals_count: '4',
    homepage_new_arrivals_category_id: '',
    homepage_featured_products_enabled: '1',
    homepage_featured_products_badge: 'Featured Products',
    homepage_featured_products_title: 'Priority models we want customers to see first.',
    homepage_featured_products_copy: 'Hand-picked products from the catalog, curated manually from admin for stronger homepage merchandising.',
    homepage_featured_product_ids: '',
  });
  const [aboutImage, setAboutImage] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [aboutImageFile, setAboutImageFile] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/public/settings');
        if (response.data) {
          setAboutImage(response.data.about_image || '');
          setSettings(prev => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching settings', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/public/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get('/public/products');
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchSettings();
    fetchCategories();
    fetchProducts();
  }, []);

  const featuredProductIds = String(settings.homepage_featured_product_ids || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      ['store_name', 'contact_email', 'contact_phone', 'contact_address', 'facebook_url', 'instagram_url', 'about_video_url', 'homepage_new_arrivals_enabled', 'homepage_new_arrivals_badge', 'homepage_new_arrivals_title', 'homepage_new_arrivals_copy', 'homepage_new_arrivals_count', 'homepage_new_arrivals_category_id', 'homepage_featured_products_enabled', 'homepage_featured_products_badge', 'homepage_featured_products_title', 'homepage_featured_products_copy', 'homepage_featured_product_ids'].forEach(key => {
        if (settings[key] !== null && settings[key] !== undefined) {
          formData.append(`settings[${key}]`, settings[key]);
        }
      });
      
      if (aboutImageFile) {
        formData.append('about_image', aboutImageFile);
      }

      await api.post('/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('Settings saved successfully!');
      setAboutImageFile(null);
      // Re-fetch to update any newly uploaded file paths
      const response = await api.get('/public/settings');
      if (response.data) {
        setAboutImage(response.data.about_image || '');
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error saving settings', error);
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Settings size={32} color="var(--clr-brand-primary)" />
        <h1>System Settings</h1>
      </div>
      <div className="card" style={{ maxWidth: '800px' }}>
        <h3>General Preferences</h3>
        <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Configure main system settings here.</p>
        
        {message && (
          <div style={{ padding: '10px', marginBottom: '1rem', backgroundColor: message.includes('success') ? 'var(--clr-brand-secondary)' : '#ef4444', color: 'black', borderRadius: '4px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Store Name</label>
            <input type="text" name="store_name" value={settings.store_name} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Contact Email</label>
            <input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Contact Phone</label>
            <input type="text" name="contact_phone" value={settings.contact_phone} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Contact Address</label>
            <input type="text" name="contact_address" value={settings.contact_address} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>

          <h4 style={{ marginTop: '1rem', borderTop: '1px solid var(--clr-border)', paddingTop: '1rem' }}>Page Media</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>About Us Image</label>
            {aboutImage && !aboutImageFile && (
              <div style={{ width: '100%', maxWidth: '240px', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.5rem', background: 'var(--clr-surface-metallic)' }}>
                <img src={aboutImage} alt="Current About Image" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => setAboutImageFile(e.target.files[0])} style={{ padding: '0.5rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>Leave empty to keep the current image</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>About Us Video URL (YouTube / Vimeo)</label>
            <input type="url" name="about_video_url" value={settings.about_video_url || ''} onChange={handleChange} placeholder="e.g. https://www.youtube.com/watch?v=..." style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>If provided, this HD video will optimally load over the image on the About page.</span>
          </div>
          
          <h4 style={{ marginTop: '1rem', borderTop: '1px solid var(--clr-border)', paddingTop: '1rem' }}>Social Media Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Facebook URL</label>
            <input type="url" name="facebook_url" value={settings.facebook_url} onChange={handleChange} placeholder="https://facebook.com/..." style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Instagram URL</label>
            <input type="url" name="instagram_url" value={settings.instagram_url} onChange={handleChange} placeholder="https://instagram.com/..." style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>

          <h4 style={{ marginTop: '1rem', borderTop: '1px solid var(--clr-border)', paddingTop: '1rem' }}>Homepage Merchandising</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              id="homepage_new_arrivals_enabled"
              type="checkbox"
              checked={settings.homepage_new_arrivals_enabled === '1'}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                homepage_new_arrivals_enabled: e.target.checked ? '1' : '0',
              }))}
            />
            <label htmlFor="homepage_new_arrivals_enabled" style={{ fontWeight: '600' }}>
              Show New Arrivals section on homepage
            </label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Section Badge</label>
            <input type="text" name="homepage_new_arrivals_badge" value={settings.homepage_new_arrivals_badge || ''} onChange={handleChange} placeholder="New Arrivals" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Section Title</label>
            <input type="text" name="homepage_new_arrivals_title" value={settings.homepage_new_arrivals_title || ''} onChange={handleChange} placeholder="Fresh stock ready for specification." style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Section Copy</label>
            <textarea name="homepage_new_arrivals_copy" value={settings.homepage_new_arrivals_copy || ''} onChange={handleChange} rows={4} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600' }}>How Many Products</label>
              <input type="number" min="1" max="12" name="homepage_new_arrivals_count" value={settings.homepage_new_arrivals_count || '4'} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600' }}>Optional Category Filter</label>
              <select name="homepage_new_arrivals_category_id" value={settings.homepage_new_arrivals_category_id || ''} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }}>
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
            This section automatically uses the newest products already in your inventory and can optionally focus on one category.
          </span>

          <h4 style={{ marginTop: '1rem', borderTop: '1px solid var(--clr-border)', paddingTop: '1rem' }}>Featured Products</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              id="homepage_featured_products_enabled"
              type="checkbox"
              checked={settings.homepage_featured_products_enabled === '1'}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                homepage_featured_products_enabled: e.target.checked ? '1' : '0',
              }))}
            />
            <label htmlFor="homepage_featured_products_enabled" style={{ fontWeight: '600' }}>
              Show Featured Products section on homepage
            </label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Section Badge</label>
            <input type="text" name="homepage_featured_products_badge" value={settings.homepage_featured_products_badge || ''} onChange={handleChange} placeholder="Featured Products" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Section Title</label>
            <input type="text" name="homepage_featured_products_title" value={settings.homepage_featured_products_title || ''} onChange={handleChange} placeholder="Priority models we want customers to see first." style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Section Copy</label>
            <textarea name="homepage_featured_products_copy" value={settings.homepage_featured_products_copy || ''} onChange={handleChange} rows={4} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontWeight: '600' }}>Choose Featured Products</label>
            <div style={{ display: 'grid', gap: '0.6rem', maxHeight: '260px', overflowY: 'auto', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', padding: '0.9rem', background: 'rgba(255,255,255,0.7)' }}>
              {products.map((product) => {
                const productId = String(product.id);
                const checked = featuredProductIds.includes(productId);

                return (
                  <label key={product.id} style={{ display: 'flex', alignItems: 'start', gap: '0.7rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const nextIds = e.target.checked
                          ? [...featuredProductIds, productId]
                          : featuredProductIds.filter((id) => id !== productId);

                        setSettings(prev => ({
                          ...prev,
                          homepage_featured_product_ids: Array.from(new Set(nextIds)).join(','),
                        }));
                      }}
                    />
                    <span>
                      <strong style={{ display: 'block' }}>{product.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                        {product.category?.name || 'Uncategorized'} · {product.in_stock ? 'In stock' : 'Out of stock'}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
              Pick the exact products you want shown. Their order follows the selection order saved in settings.
            </span>
          </div>

          <div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <AdminPasswordChangePanel
          title="Admin Login Security"
          description="Change the admin password here. Every password update requires a one-time verification code sent to the admin email."
          submitLabel="Change Admin Password"
        />
      </div>
    </div>
  );
};

export default AdminSettings;
