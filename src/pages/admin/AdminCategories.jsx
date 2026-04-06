import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit2, Check, X, Zap, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const EMPTY_FORM = { name: '', is_pump: true, has_ideal_power: false };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch { setError('Failed to load categories.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError('');
  };

  const openEdit = (cat) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      is_pump: cat.is_pump ?? true,
      has_ideal_power: cat.has_ideal_power,
    });
    setShowForm(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Category name is required.'); return; }
    setSaving(true); setError('');
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form);
      } else {
        await api.post('/categories', form);
      }
      setShowForm(false);
      await fetchCategories();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(' ') : 'Failed to save category.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setDeleteConfirm(null);
      await fetchCategories();
    } catch { setError('Cannot delete category — it may have products linked to it.'); setDeleteConfirm(null); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Tag size={32} color="var(--clr-brand-primary)" />
          <h1 style={{ margin: 0 }}>Categories</h1>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <AlertCircle size={16} /><span>{error}</span>
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}><X size={16} /></button>
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--clr-brand-primary)', borderWidth: '2px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editId ? 'Edit Category' : 'New Category'}</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Category Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Industrial Pumps, Borehole Pumps..."
                style={{ padding: '0.75rem 1rem', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Category Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_pump: true })}
                  style={{
                    border: form.is_pump ? '1.5px solid var(--clr-brand-primary)' : '1.5px solid var(--clr-border)',
                    background: form.is_pump ? 'rgba(2,101,192,0.08)' : 'var(--clr-surface-metallic)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Pump</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>
                    Shows pump specification fields like flow rate, height and depth.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_pump: false, has_ideal_power: false })}
                  style={{
                    border: !form.is_pump ? '1.5px solid var(--clr-brand-primary)' : '1.5px solid var(--clr-border)',
                    background: !form.is_pump ? 'rgba(2,101,192,0.08)' : 'var(--clr-surface-metallic)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Other</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>
                    Only needs the product description. No pump-specific specification inputs.
                  </div>
                </button>
              </div>
            </div>

            {form.is_pump && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: form.has_ideal_power ? 'rgba(255,183,3,0.08)' : 'var(--clr-surface-metallic)', borderRadius: 'var(--radius-md)', padding: '1rem', border: form.has_ideal_power ? '1.5px solid var(--clr-accent)' : '1.5px solid var(--clr-border)', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setForm({ ...form, has_ideal_power: !form.has_ideal_power })}>
                <div style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.has_ideal_power ? 'var(--clr-accent)' : 'var(--clr-border)', position: 'relative', transition: 'background 0.2s', flexShrink: 0, marginTop: '2px' }}>
                  <div style={{ position: 'absolute', top: '3px', left: form.has_ideal_power ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                    <Zap size={16} color={form.has_ideal_power ? 'var(--clr-accent)' : 'var(--clr-text-muted)'} />
                    <span>Requires Ideal Power field</span>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                    When enabled, products in this category will have an "Ideal Power" input field (e.g. 1.5 kW, 2HP).
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Check size={16} /> {saving ? 'Saving...' : 'Save Category'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                <X size={16} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--clr-text-muted)' }}>Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Tag size={48} color="var(--clr-border)" style={{ marginBottom: '1rem' }} />
          <h3>No Categories Yet</h3>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Create your first category to start organizing products.</p>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Create Category</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {categories.map((cat) => (
            <div key={cat.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{cat.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEdit(cat)} style={{ background: 'none', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', padding: '0.3rem', cursor: 'pointer', color: 'var(--clr-text-muted)', display: 'flex' }}>
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => setDeleteConfirm(cat.id)} style={{ background: 'none', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', padding: '0.3rem', cursor: 'pointer', color: '#dc2626', display: 'flex' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: cat.is_pump ? 'var(--clr-brand-primary)' : 'var(--clr-text-muted)', background: cat.is_pump ? 'rgba(2,101,192,0.08)' : 'var(--clr-surface-metallic)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--clr-border)', fontWeight: 600 }}>
                  {cat.is_pump ? 'Pump' : 'Other'}
                </span>
                {cat.has_ideal_power
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#92400e', background: '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid #fde68a', fontWeight: 600 }}><Zap size={12} />Ideal Power Enabled</span>
                  : <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>{cat.is_pump ? 'No ideal power field' : 'Description only'}</span>
                }
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>{cat.products_count ?? 0} product{cat.products_count !== 1 ? 's' : ''}</span>
              </div>

              {deleteConfirm === cat.id && (
                <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginTop: '0.25rem' }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#991b1b', fontWeight: 500 }}>Delete this category? All linked products will also be deleted.</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ background: '#dc2626', color: '#fff', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={() => handleDelete(cat.id)}>Yes, delete</button>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
