import React from 'react';
import { ShieldCheck } from 'lucide-react';
import AdminPasswordChangePanel from '../../components/admin/AdminPasswordChangePanel';
import Seo from '../../components/Seo';

const ChangePassword = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--clr-brand-primary) 0%, #013b70 60%, #011d3a 100%)',
      padding: '2rem',
    }}>
      <Seo
        title="Change Password | Doyin Pumps Kenya Admin"
        description="Doyin Pumps Kenya admin password update page."
        path="/admin/change-password"
        noindex
        nofollow
      />
      <div style={{
        background: 'var(--clr-surface-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        animation: 'slideUp 0.4s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={44} color="var(--clr-brand-primary)" />
          <h2 style={{ marginTop: '0.75rem' }}>Set New Password</h2>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            For your security, you must set a new password and verify the change with a one-time email code before continuing.
          </p>
        </div>

        <AdminPasswordChangePanel
          title="Set New Password"
          description="Complete the password update with a one-time code sent to your admin email."
          submitLabel="Save New Password and Continue"
          successRedirect="/admin"
          compact
        />
      </div>
    </div>
  );
};

export default ChangePassword;
