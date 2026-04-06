import React, { useState, useEffect, useRef } from 'react';
import { Package, Plus, Trash2, Edit2, X, Check, AlertCircle, ImageIcon, Zap, Search, MessageCircle } from 'lucide-react';
import api from '../../services/api';

const EMPTY_FORM = {
  category_id: '',
  name: '',
  description: '',
  max_flow_rate: '',
  max_height: '',
  recommended_depth: '',
  ideal_power: '',
  image: null,
  in_stock: true,
};

const clearPumpFields = (currentForm) => ({
  ...currentForm,
  max_flow_rate: '',
  max_height: '',
  recommended_depth: '',
  ideal_power: '',
});

const getCategoryLabel = (category) => `${category.name}${category.is_pump ? ' (Pump)' : ' (Other)'}${category.has_ideal_power ? ' [Ideal Power]' : ''}`;

const normalizeText = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [similarProduct, setSimilarProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef();

  const selectedCategory = categories.find((c) => String(c.id) === String(form.category_id));
  const normalizedName = normalizeText(form.name);
  const similarNameMatches = normalizedName
    ? products.filter((product) => {
        if (editProduct && product.id === editProduct.id) return false;

        const existingName = normalizeText(product.name);
        if (!existingName) return false;

        return existingName === normalizedName;
      })
    : [];
  const liveDuplicateProduct = similarNameMatches[0] || null;
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) => {
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
      })
    : products;

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setShowForm(true);
    setError('');
    setSimilarProduct(null);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      category_id: String(product.category_id),
      name: product.name,
      description: product.description || '',
      max_flow_rate: product.max_flow_rate || '',
      max_height: product.max_height || '',
      recommended_depth: product.recommended_depth || '',
      ideal_power: product.ideal_power || '',
      image: null,
      in_stock: product.in_stock !== undefined ? product.in_stock : true,
    });
    setImagePreview(product.image_url || null);
    setShowForm(true);
    setError('');
    setSimilarProduct(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find((item) => String(item.id) === String(categoryId));

    setForm((currentForm) => {
      const nextForm = { ...currentForm, category_id: categoryId };

      if (category && !category.is_pump) {
        return clearPumpFields(nextForm);
      }

      if (category && !category.has_ideal_power) {
        return { ...nextForm, ideal_power: '' };
      }

      return nextForm;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.category_id) { setError('Please select a category.'); return; }
    if (!form.name.trim()) { setError('Product name is required.'); return; }
    if (liveDuplicateProduct) {
      setSimilarProduct(liveDuplicateProduct);
      setError('A similar product name already exists. Open it from the suggestions and edit it instead.');
      return;
    }

    setSaving(true);
    setError('');
    setSimilarProduct(null);

    const preparedForm = selectedCategory?.is_pump ? form : clearPumpFields(form);
    const fd = new FormData();

    Object.entries(preparedForm).forEach(([k, v]) => {
      if (k === 'in_stock') {
        fd.append(k, v ? 1 : 0);
      } else if (k !== 'image' && v !== null) {
        fd.append(k, v);
      }
    });

    if (form.image) fd.append('image', form.image);

    try {
      if (editProduct) {
        fd.append('_method', 'PUT');
        await api.post(`/products/${editProduct.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowForm(false);
      setSimilarProduct(null);
      await fetchAll();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setSimilarProduct(err.response?.data?.similar_product || null);
      setError(
        err.response?.data?.message
          || (errors ? Object.values(errors).flat().join(' ') : 'Failed to save product.')
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setDeleteConfirm(null);
      await fetchAll();
    } catch {
      setError('Failed to delete product.');
      setDeleteConfirm(null);
    }
  };

  const inputStyle = { padding: '0.7rem 1rem', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', width: '100%' };
  const labelStyle = { fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Package size={32} color="var(--clr-brand-primary)" />
          <h1 style={{ margin: 0 }}>Inventory</h1>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add Product</button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-full)', padding: '0.5rem 0.75rem 0.5rem 1rem', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem' }}>
        <Search size={18} color="var(--clr-text-muted)" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search inventory by name, description, category or specification..."
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', fontFamily: 'inherit' }}
        />
        <button type="button" className="btn btn-primary" style={{ padding: '0.55rem 1rem' }}>
          Search
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={16} /><span style={{ flex: 1 }}>{error}</span>
          {similarProduct && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => openEdit(similarProduct)}
              style={{ padding: '0.35rem 0.75rem', whiteSpace: 'nowrap' }}
            >
              Edit Existing Product
            </button>
          )}
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', display: 'flex' }}><X size={16} /></button>
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--clr-brand-primary)', borderWidth: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)', display: 'flex' }}><X size={20} /></button>
          </div>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Category *</label>
                <select value={form.category_id} onChange={(e) => handleCategoryChange(e.target.value)} style={inputStyle} required>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {getCategoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Product Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: liveDuplicateProduct ? '#f59e0b' : inputStyle.border.split(' ').slice(-1)[0],
                      boxShadow: liveDuplicateProduct ? '0 0 0 3px rgba(245, 158, 11, 0.12)' : 'none',
                    }}
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      setSimilarProduct(null);
                      setError('');
                    }}
                    placeholder="e.g. Submersible Pump 2HP Model X"
                    required
                    autoComplete="off"
                  />
                  {similarNameMatches.length > 0 && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 0.35rem)', left: 0, right: 0, background: '#fff', border: '1px solid #fcd34d', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 20, overflow: 'hidden' }}>
                      <div style={{ padding: '0.65rem 0.85rem', fontSize: '0.78rem', fontWeight: 700, color: '#92400e', background: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
                        A product with this exact name already exists
                      </div>
                      {similarNameMatches.slice(0, 5).map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setSimilarProduct(product);
                            setError('A similar product already exists. Edit the existing product instead of creating another one.');
                            openEdit(product);
                          }}
                          style={{ width: '100%', border: 'none', background: '#fff', textAlign: 'left', padding: '0.8rem 0.9rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                        >
                          <div style={{ fontWeight: 600, color: 'var(--clr-text-main)' }}>{product.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: '0.2rem' }}>
                            {product.category?.name || 'Uncategorized'}{product.description ? ` • ${product.description.slice(0, 70)}${product.description.length > 70 ? '...' : ''}` : ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {liveDuplicateProduct && (
                  <p style={{ margin: '0.45rem 0 0', fontSize: '0.82rem', color: '#92400e' }}>
                    This exact product name already exists. Select it from the dropdown to edit it.
                  </p>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief product description..." />
              </div>

              {selectedCategory?.is_pump ? (
                <>
                  <div>
                    <label style={labelStyle}>Max Flow Rate</label>
                    <input style={inputStyle} type="text" value={form.max_flow_rate} onChange={(e) => setForm({ ...form, max_flow_rate: e.target.value })} placeholder="e.g. 120 L/min" />
                  </div>
                  <div>
                    <label style={labelStyle}>Max Pumping Height</label>
                    <input style={inputStyle} type="text" value={form.max_height} onChange={(e) => setForm({ ...form, max_height: e.target.value })} placeholder="e.g. 80m" />
                  </div>
                  <div>
                    <label style={labelStyle}>Recommended Depth</label>
                    <input style={inputStyle} type="text" value={form.recommended_depth} onChange={(e) => setForm({ ...form, recommended_depth: e.target.value })} placeholder="e.g. 30-60m" />
                  </div>

                  {selectedCategory.has_ideal_power && (
                    <div>
                      <label style={{ ...labelStyle, color: '#92400e' }}>
                        <Zap size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Ideal Power
                      </label>
                      <input style={{ ...inputStyle, borderColor: 'var(--clr-accent)' }} type="text" value={form.ideal_power} onChange={(e) => setForm({ ...form, ideal_power: e.target.value })} placeholder="e.g. 1.5 kW / 2HP" />
                    </div>
                  )}
                </>
              ) : selectedCategory ? (
                <div style={{ gridColumn: '1 / -1', background: 'var(--clr-surface-metallic)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1rem', color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>
                  This category is marked as <strong style={{ color: 'var(--clr-text-main)' }}>Other</strong>, so only the product description is needed. Pump specification fields are hidden.
                </div>
              ) : null}

              <div>
                <label style={labelStyle}>Availability</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                  <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--clr-brand-secondary)' }} />
                  <span>Currently In Stock</span>
                </label>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Product Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    onClick={() => fileRef.current.click()}
                    style={{ width: '120px', height: '120px', border: '2px dashed var(--clr-border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--clr-surface-metallic)', flexShrink: 0, overflow: 'hidden', transition: 'border-color 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--clr-brand-primary)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--clr-border)'; }}
                  >
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }} />
                      : <><ImageIcon size={28} color="var(--clr-text-muted)" /><span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginTop: '0.5rem' }}>Click to upload</span></>}
                  </div>
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    <button type="button" className="btn btn-outline" onClick={() => fileRef.current.click()} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Choose Image</button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginTop: '0.5rem' }}>JPEG, PNG, WebP - max 4MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--clr-border)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}><Check size={16} /> {saving ? 'Saving...' : 'Save Product'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}><X size={16} /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--clr-text-muted)', padding: '3rem' }}>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Package size={48} color="var(--clr-border)" style={{ marginBottom: '1rem' }} />
          <h3>{normalizedQuery ? 'No Matching Products' : 'No Products Yet'}</h3>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>
            {normalizedQuery
              ? `No products matched "${searchTerm.trim()}". Product descriptions were also checked and nothing matched.`
              : 'Add your first product to populate the catalog.'}
          </p>
          {normalizedQuery ? (
            <a
              href={`https://wa.me/254742167151?text=${encodeURIComponent(`Hi, I need help tracing a product using the keyword "${searchTerm.trim()}". Please assist me.`)}`}
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <MessageCircle size={16} /> Ask Sales
            </a>
          ) : (
            <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Product</button>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--clr-surface-metallic)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem' }}>Product</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem' }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem' }}>Flow Rate</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem' }}>Max Height</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem' }}>Depth</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  <tr style={{ borderTop: '1px solid var(--clr-border)', background: index % 2 === 1 ? 'var(--clr-bg-page)' : 'transparent' }}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--clr-surface-metallic)', overflow: 'hidden', flexShrink: 0 }}>
                        {product.image_url
                          ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={20} color="var(--clr-text-muted)" /></div>}
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.9rem' }}>{product.name}</strong>
                        {product.ideal_power && <span style={{ fontSize: '0.75rem', color: '#92400e' }}>[Ideal Power] {product.ideal_power}</span>}
                        <div style={{ marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '4px', background: product.in_stock ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: product.in_stock ? '#10b981' : '#ef4444' }}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}><span className="badge" style={{ background: 'rgba(2,101,192,0.1)', color: 'var(--clr-brand-primary)', border: '1px solid rgba(2,101,192,0.2)', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>{product.category?.name || '-'}</span></td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>{product.max_flow_rate || '-'}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>{product.max_height || '-'}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>{product.recommended_depth || '-'}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button onClick={() => openEdit(product)} style={{ background: 'none', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', cursor: 'pointer', color: 'var(--clr-text-muted)', display: 'flex' }}><Edit2 size={15} /></button>
                        <button onClick={() => setDeleteConfirm(product.id)} style={{ background: 'none', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', padding: '0.4rem', cursor: 'pointer', color: '#dc2626', display: 'flex' }}><Trash2 size={15} /></button>
                      </div>
                      {deleteConfirm === product.id && (
                        <div style={{ position: 'absolute', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginTop: '0.5rem', zIndex: 10, textAlign: 'left', width: '200px', boxShadow: 'var(--shadow-md)' }}>
                          <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: '#991b1b', fontWeight: 500 }}>Delete this product?</p>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn" style={{ background: '#dc2626', color: '#fff', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleDelete(product.id)}>Delete</button>
                            <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
