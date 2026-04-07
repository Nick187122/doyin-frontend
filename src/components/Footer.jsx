import { MapPin, Phone, Mail } from 'lucide-react';
import { usePublicSite } from '../context/PublicSiteContext';

const Footer = () => {
  const { settings } = usePublicSite();

  return (
    <footer style={{ background: 'var(--clr-text-main)', color: 'var(--clr-text-inverse)', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <h3 style={{ color: 'var(--clr-text-inverse)', marginBottom: '1.5rem' }}>DOYIN KENYA</h3>
          <p style={{ color: 'var(--clr-text-muted)', lineHeight: '1.6' }}>
            Delivering high-performance fluid mechanics engineering across East Africa. Specializing in Deep well Submersible water pumps.
          </p>
        </div>
        
        <div>
          <h4 style={{ color: 'var(--clr-surface-metallic)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.1em' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><a href="/" style={{ color: 'var(--clr-text-muted)' }}>Home</a></li>
            <li><a href="/products" style={{ color: 'var(--clr-text-muted)' }}>Products</a></li>
            <li><a href="/about" style={{ color: 'var(--clr-text-muted)' }}>About Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 style={{ color: 'var(--clr-surface-metallic)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.1em' }}>
            Contact Us
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '1rem', color: 'var(--clr-text-muted)' }}>
              <MapPin size={20} color="var(--clr-brand-secondary)" style={{ flexShrink: 0 }} /> <span>{settings.contact_address || 'Nairobi, Kenya'}</span>
            </li>
            <li style={{ display: 'flex', gap: '1rem', color: 'var(--clr-text-muted)' }}>
              <Phone size={20} color="var(--clr-brand-secondary)" style={{ flexShrink: 0 }} /> <span>{settings.contact_phone || '+254 742 167 151'}</span>
            </li>
            <li style={{ display: 'flex', gap: '1rem', color: 'var(--clr-text-muted)' }}>
              <Mail size={20} color="var(--clr-brand-secondary)" style={{ flexShrink: 0 }} /> <a href={`mailto:${settings.contact_email || 'info@doyinkenya.com'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{settings.contact_email || 'info@doyinkenya.com'}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container" style={{ borderTop: '1px solid #334155', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Doyin Kenya. All rights reserved.
        </p>
        <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center' }}>
          Created by{' '}
          <a
            href="https://github.com/Nick187122"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--clr-brand-secondary)', fontWeight: 600, textDecoration: 'none' }}
          >
            XLCH3MIST
          </a>
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href={settings.facebook_url || '#'} target="_blank" rel="noreferrer" style={{ color: '#94a3b8' }}>Facebook</a>
          <a href={settings.instagram_url || '#'} target="_blank" rel="noreferrer" style={{ color: '#94a3b8' }}>Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

