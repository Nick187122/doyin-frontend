import { ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="container section-padding">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ShieldAlert size={32} color="var(--clr-brand-primary)" />
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="card">
        <h3>Secure Area</h3>
        <p style={{marginBottom: '1rem', color: 'var(--clr-text-muted)'}}>
          This section is currently unauthenticated. Authentication will be tied to the Laravel backend.
        </p>
        <button className="btn btn-primary">Add New Product</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
