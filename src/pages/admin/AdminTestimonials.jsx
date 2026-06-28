import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Plus, Pencil, Trash2, Check, X, Star, ToggleLeft, ToggleRight, Loader2, User, Play } from 'lucide-react';
import api from '../../services/api';

const EMPTY_FORM = {
  name: '',
  title: '',
  company: '',
  content: '',
  rating: 5,
  is_visible: true,
  sort_order: 0,
  avatar: null,
  video: null,
  existing_video_url: null,
  remove_video: false,
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchAll = async () => {
    try {
      const res = await api.get('/testimonials');
      setTestimonials(res.data);
    } catch {
      setError('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (testimonial) => {
    setForm({
      name: testimonial.name,
      title: testimonial.title || '',
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating || 5,
      is_visible: testimonial.is_visible,
      sort_order: testimonial.sort_order || 0,
      avatar: null,
      video: null,
      existing_video_url: testimonial.video_url || null,
      remove_video: false,
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('content', form.content);
    if (form.title) fd.append('title', form.title);
    if (form.company) fd.append('company', form.company);
    fd.append('rating', form.rating);
    fd.append('is_visible', form.is_visible ? '1' : '0');
    fd.append('sort_order', form.sort_order);
    if (form.avatar) fd.append('avatar', form.avatar);
    if (form.video) fd.append('video', form.video);
    if (form.remove_video) fd.append('remove_video', '1');

    try {
      if (editingId) {
        fd.append('_method', 'PUT');
        await api.post(`/testimonials/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/testimonials', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      await fetchAll();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  const handleToggleVisibility = async (testimonial) => {
    try {
      await api.put(`/testimonials/${testimonial.id}`, { is_visible: !testimonial.is_visible });
      setTestimonials(prev => prev.map(t =>
        t.id === testimonial.id ? { ...t, is_visible: !t.is_visible } : t
      ));
    } catch {
      alert('Failed to update visibility.');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? '#f59e0b' : 'none'}
        color={i < rating ? '#f59e0b' : '#d1d5db'}
      />
    ));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <MessageSquareQuote size={32} color="var(--clr-brand-primary)" />
          <h1 style={{ margin: 0 }}>Testimonials</h1>
        </div>
        <p style={{ color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}>
          Manage customer testimonials. Visible testimonials will appear on the public homepage.
        </p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}><X size={16} /></button>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--clr-brand-primary)', borderWidth: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
            <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)', display: 'flex' }}><X size={20} /></button>
          </div>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. John Mwangi" style={{ padding: '0.7rem 1rem', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Title / Position</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Farm Owner" style={{ padding: '0.7rem 1rem', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Company</label>
                <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Green Valley Farm" style={{ padding: '0.7rem 1rem', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Rating (1-5)</label>
                <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} style={{ padding: '0.7rem 1rem', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', width: '100%' }}>
                  {[5, 4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Testimonial Content *</label>
                <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} placeholder="Write the testimonial..." style={{ padding: '0.7rem 1rem', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', width: '100%', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Avatar Image</label>
                <input type="file" accept="image/*" onChange={e => setForm({ ...form, avatar: e.target.files[0] })} style={{ padding: '0.5rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', width: '100%' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>Optional. Max 2MB.</span>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Video</label>
                <input type="file" accept="video/*" onChange={e => setForm({ ...form, video: e.target.files[0] })} style={{ padding: '0.5rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', width: '100%' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>Optional. MP4, MOV, WebM. Max 20MB.</span>
                {form.existing_video_url && !form.video && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <video src={form.existing_video_url} controls style={{ width: '100%', maxHeight: '120px', borderRadius: 'var(--radius-md)' }} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#ef4444', cursor: 'pointer' }}>
                      <input type="checkbox" checked={!!form.remove_video} onChange={e => setForm({ ...form, remove_video: e.target.checked })} style={{ width: '16px', height: '16px' }} />
                      Remove video
                    </label>
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} style={{ padding: '0.7rem 1rem', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', width: '100%' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} id="visible-cb" style={{ width: '18px', height: '18px' }} />
                <label htmlFor="visible-cb" style={{ fontWeight: 600 }}>Visible on homepage</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--clr-border)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Check size={16} /> {editingId ? 'Update' : 'Create'}</>}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm}><X size={16} /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--clr-text-muted)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Loading...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--clr-text-muted)' }}>
          <MessageSquareQuote size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No testimonials yet. Add your first one!</p>
          {!showForm && (
            <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: '1rem' }}>
              <Plus size={16} /> Add Testimonial
            </button>
          )}
        </div>
      ) : (
        <>
          {!showForm && (
            <button className="btn btn-primary" onClick={openCreate} style={{ marginBottom: '1.5rem' }}>
              <Plus size={16} /> Add Testimonial
            </button>
          )}
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '240px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(2,101,192,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-brand-primary)', flexShrink: 0, overflow: 'hidden' }}>
                    {testimonial.avatar_url ? (
                      <img src={testimonial.avatar_url} alt={testimonial.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1rem' }}>{testimonial.name}</strong>
                      <span style={{ display: 'flex', gap: '0.15rem' }}>{renderStars(testimonial.rating || 5)}</span>
                    </div>
                    {(testimonial.title || testimonial.company) && (
                      <p style={{ margin: '0.15rem 0', fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>
                        {[testimonial.title, testimonial.company].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--clr-text-main)', lineHeight: 1.7, fontStyle: 'italic' }}>
                      &ldquo;{testimonial.content.length > 150 ? `${testimonial.content.slice(0, 150)}...` : testimonial.content}&rdquo;
                    </p>
                    {testimonial.video_url && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--clr-brand-primary)', fontWeight: 600 }}>
                        <Play size={12} /> Video attached
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>Order: {testimonial.sort_order}</span>
                  <button
                    onClick={() => handleToggleVisibility(testimonial)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: testimonial.is_visible ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}
                    title={testimonial.is_visible ? 'Click to hide' : 'Click to show'}
                  >
                    {testimonial.is_visible ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                    {testimonial.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button className="btn btn-outline" onClick={() => openEdit(testimonial)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(testimonial.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminTestimonials;
