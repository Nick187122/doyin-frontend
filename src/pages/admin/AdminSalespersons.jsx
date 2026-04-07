import React, { useState, useEffect } from 'react';
import { UserPlus, Pencil, Trash2, Check, X, Phone, User, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AdminSalespersons = () => {
  const [salespersons, setSalespersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', phone_number: '', is_active: true });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    try {
      const res = await api.get('/salespersons');
      setSalespersons(res.data);
    } catch {
      setError('Failed to load salespersons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const resetForm = () => {
    setForm({ name: '', phone_number: '', is_active: true });
    setEditingId(null);
  };

  const handleEdit = (person) => {
    setEditingId(person.id);
    setForm({ name: person.name, phone_number: person.phone_number, is_active: person.is_active });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/salespersons/${editingId}`, form);
      } else {
        await api.post('/salespersons', form);
      }
      await fetchAll();
      resetForm();
    } catch {
      alert('Failed to save. Please check the details and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this salesperson?')) return;
    try {
      await api.delete(`/salespersons/${id}`);
      setSalespersons(prev => prev.filter(s => s.id !== id));
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  const handleToggleActive = async (person) => {
    try {
      await api.put(`/salespersons/${person.id}`, { is_active: !person.is_active });
      setSalespersons(prev => prev.map(s => s.id === person.id ? { ...s, is_active: !s.is_active } : s));
    } catch {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Sales Representatives</h1>
        <p style={{ color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}>
          Manage the sales team. Active reps will appear in the customer enquiry dropdown on the website.
        </p>
      </div>

      {/* Add / Edit Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
          {editingId ? '✏️ Edit Sales Representative' : '➕ Add New Sales Representative'}
        </h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} /> Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Mwangi"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={15} /> WhatsApp Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 254712345678"
              value={form.phone_number}
              onChange={e => setForm({ ...form, phone_number: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.15rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Active</label>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: form.is_active ? '#10b981' : 'var(--clr-text-muted)', padding: 0 }}
            >
              {form.is_active ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : (editingId ? <Check size={18} /> : <UserPlus size={18} />)}
              {saving ? 'Saving...' : (editingId ? 'Update' : 'Add Rep')}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline" onClick={resetForm} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <X size={16} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--clr-text-muted)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Loading...</p>
        </div>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : salespersons.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--clr-text-muted)' }}>
          <UserPlus size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No sales representatives yet. Add your first one above!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {salespersons.map(person => (
            <div key={person.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(2,101,192,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-brand-primary)', flexShrink: 0 }}>
                  <User size={22} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>{person.name}</p>
                  <p style={{ margin: 0, color: 'var(--clr-text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={13} /> {person.phone_number}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => handleToggleActive(person)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: person.is_active ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}
                  title={person.is_active ? 'Click to deactivate' : 'Click to activate'}
                >
                  {person.is_active ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                  {person.is_active ? 'Active' : 'Inactive'}
                </button>
                <button className="btn btn-outline" onClick={() => handleEdit(person)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(person.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminSalespersons;
