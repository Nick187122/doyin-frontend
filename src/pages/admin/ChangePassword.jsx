import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ChangePassword = () => {
  const { onPasswordChanged } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setError('New passwords do not match.'); return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }
    setError(''); setLoading(true);
    try {
      await api.post('/change-password', form);
      onPasswordChanged();
      navigate('/admin');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError(err.response?.data?.message || 'Failed to change password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--clr-brand-primary) 0%, #013b70 60%, #011d3a 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'var(--clr-surface-light)', borderRadius: 'var(--radius-lg)',
        padding: '3rem', width: '100%', maxWidth: '440px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        animation: 'slideUp 0.4s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={44} color="var(--clr-brand-primary)" />
          <h2 style={{ marginTop: '0.75rem' }}>Set New Password</h2>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            For your security, you must set a new password before continuing.
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
            fontSize: '0.9rem', marginBottom: '1.5rem'
          }}>
            <AlertCircle size={16} /><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[
            { id: 'current_password', label: 'Current Password', key: 'current_password' },
            { id: 'password', label: 'New Password', key: 'password' },
            { id: 'password_confirmation', label: 'Confirm New Password', key: 'password_confirmation' },
          ].map(({ id, label, key }) => (
            <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor={id} style={{ fontWeight: '600', fontSize: '0.9rem' }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <input
                  id={id}
                  type={showPw ? 'text' : 'password'}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  style={{
                    padding: '0.75rem 3rem 0.75rem 1rem', border: '1.5px solid var(--clr-border)',
                    borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit',
                    outline: 'none', width: '100%'
                  }}
                />
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>
            <input type="checkbox" id="showpw" onChange={() => setShowPw(!showPw)} />
            <label htmlFor="showpw">Show passwords</label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
            {loading ? 'Saving...' : 'Save New Password & Continue →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
