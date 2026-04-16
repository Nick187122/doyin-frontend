import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, MailCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const initialForm = {
  current_password: '',
  password: '',
  password_confirmation: '',
  otp: '',
};

const fieldStyle = {
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--clr-border)',
  fontSize: '1rem',
  width: '100%',
  fontFamily: 'inherit',
};

const AdminPasswordChangePanel = ({
  title = 'Change Admin Password',
  description = 'Update the admin password and confirm the change with a one-time email code.',
  submitLabel = 'Update Password',
  successRedirect = null,
  compact = false,
}) => {
  const navigate = useNavigate();
  const { user, onPasswordChanged } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const getErrorMessage = (err, fallback) => {
    const errors = err.response?.data?.errors;
    if (errors) {
      return Object.values(errors).flat().join(' ');
    }

    return err.response?.data?.message || fallback;
  };

  const validateBeforeOtp = () => {
    if (form.password !== form.password_confirmation) {
      return 'New passwords do not match.';
    }

    if (form.password.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    return '';
  };

  const handleRequestOtp = async () => {
    const validationError = validateBeforeOtp();
    if (validationError) {
      setError(validationError);
      setMessage('');
      return;
    }

    setRequestingOtp(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/change-password/request-otp', {
        current_password: form.current_password,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setOtpSent(true);
      setMessage(response.data.message || 'Verification code sent.');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send verification code.'));
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateBeforeOtp();
    if (validationError) {
      setError(validationError);
      setMessage('');
      return;
    }

    if (!form.otp.trim()) {
      setError('Enter the verification code sent to your admin email.');
      setMessage('');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/change-password', form);
      onPasswordChanged(response.data.token);
      setOtpSent(false);
      setForm(initialForm);
      setMessage(response.data.message || 'Password changed successfully.');

      if (successRedirect) {
        navigate(successRedirect);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to change password.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={compact ? undefined : 'card'} style={compact ? undefined : { maxWidth: '800px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: '999px',
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(0, 92, 175, 0.08)',
          color: 'var(--clr-brand-primary)',
          flexShrink: 0,
        }}>
          <KeyRound size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p style={{ color: 'var(--clr-text-muted)', margin: '0.35rem 0 0' }}>{description}</p>
          {user?.email && (
            <p style={{ color: 'var(--clr-text-muted)', margin: '0.4rem 0 0', fontSize: '0.9rem' }}>
              Verification codes are sent to {user.email}.
            </p>
          )}
        </div>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.8rem 1rem',
          marginBottom: '1rem',
          background: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-md)',
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.8rem 1rem',
          marginBottom: '1rem',
          background: '#dcfce7',
          color: '#166534',
          border: '1px solid #86efac',
          borderRadius: 'var(--radius-md)',
        }}>
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="current_password" style={{ fontWeight: 600 }}>Current Password</label>
            <input
              id="current_password"
              type="password"
              value={form.current_password}
              onChange={(e) => updateField('current_password', e.target.value)}
              autoComplete="current-password"
              required
              style={fieldStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="password" style={{ fontWeight: 600 }}>New Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              autoComplete="new-password"
              required
              style={fieldStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="password_confirmation" style={{ fontWeight: 600 }}>Confirm New Password</label>
            <input
              id="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={(e) => updateField('password_confirmation', e.target.value)}
              autoComplete="new-password"
              required
              style={fieldStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="otp" style={{ fontWeight: 600 }}>Verification Code</label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={form.otp}
              onChange={(e) => updateField('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              required
              style={fieldStyle}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--clr-border)',
          paddingTop: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>
            <MailCheck size={16} />
            <span>{otpSent ? 'Verification code sent. Codes expire after 10 minutes.' : 'Request a code before saving the new password.'}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline" onClick={handleRequestOtp} disabled={requestingOtp || submitting}>
              {requestingOtp ? 'Sending Code...' : (otpSent ? 'Resend Code' : 'Send Verification Code')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || requestingOtp}>
              {submitting ? 'Updating...' : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminPasswordChangePanel;
