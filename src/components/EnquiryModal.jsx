import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ChevronDown, Loader2 } from 'lucide-react';
import api from '../services/api';

const EnquiryModal = ({ product, onClose }) => {
  const [salespersons, setSalespersons] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/public/salespersons')
      .then(res => {
        setSalespersons(res.data);
        if (res.data.length > 0) setSelectedId(String(res.data[0].id));
      })
      .catch(() => setError('Could not load sales representatives. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const selected = salespersons.find(s => String(s.id) === selectedId);

  const handleEnquire = () => {
    if (!selected) return;
    const message = `Hello ${selected.name}, I'm analyzing the ${product.name}. Please assist me with pricing and availability.`;
    const phone = selected.phone_number.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    // Log the view
    api.post(`/public/products/${product.id}/view`).catch(() => {});
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--clr-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%', maxWidth: '480px',
        border: '1px solid var(--clr-border)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, var(--clr-brand-primary), var(--clr-brand-secondary))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageCircle size={22} color="white" />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>Enquire via WhatsApp</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: '0.25rem' }}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            background: 'var(--clr-bg-page)', borderRadius: 'var(--radius-md)',
            padding: '1rem', marginBottom: '1.5rem',
            border: '1px solid var(--clr-border)',
          }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--clr-text-muted)', marginBottom: '0.3rem' }}>
              Product
            </p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--clr-text-main)' }}>
              {product.name}
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--clr-text-muted)' }}>
              <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
              <p style={{ marginTop: '0.75rem' }}>Loading sales reps...</p>
            </div>
          ) : error ? (
            <p style={{ color: 'var(--clr-brand-secondary)', textAlign: 'center', padding: '1rem' }}>{error}</p>
          ) : salespersons.length === 0 ? (
            <p style={{ color: 'var(--clr-text-muted)', textAlign: 'center', padding: '1rem' }}>
              No sales representatives are available right now. Please contact us directly.
            </p>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--clr-text-main)' }}>
                  Choose a Sales Representative
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedId}
                    onChange={e => setSelectedId(e.target.value)}
                    style={{
                      width: '100%', padding: '0.85rem 2.5rem 0.85rem 1rem',
                      border: '2px solid var(--clr-border)', borderRadius: 'var(--radius-md)',
                      fontFamily: 'inherit', fontSize: '1rem',
                      background: 'var(--clr-surface)', appearance: 'none',
                      cursor: 'pointer', color: 'var(--clr-text-main)',
                      outline: 'none',
                    }}
                  >
                    {salespersons.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--clr-text-muted)' }} />
                </div>
              </div>

              {selected && (
                <div style={{
                  background: 'rgba(2,101,192,0.06)', border: '1px solid rgba(2,101,192,0.2)',
                  borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem',
                  fontSize: '0.9rem', color: 'var(--clr-text-muted)', lineHeight: 1.6,
                }}>
                  <p style={{ margin: 0, fontStyle: 'italic' }}>
                    "<strong style={{ color: 'var(--clr-text-main)' }}>Hello {selected.name}</strong>, I'm analyzing the{' '}
                    <strong style={{ color: 'var(--clr-text-main)' }}>{product.name}</strong>. Please assist me with pricing and availability."
                  </p>
                </div>
              )}

              <button
                onClick={handleEnquire}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default EnquiryModal;
