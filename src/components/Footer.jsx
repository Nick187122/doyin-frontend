import { MapPin, Phone, Mail } from 'lucide-react';
import { usePublicSite } from '../context/PublicSiteContext';
import './Footer.css';

const Footer = () => {
  const { settings } = usePublicSite();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <div className="eyebrow">Doyin Pumps Kenya</div>
            <h3>Engineered water movement with a sharper retail experience.</h3>
            <p>
            Delivering high-performance fluid mechanics engineering across East Africa. Specializing in Deep well Submersible water pumps.
            </p>
          </div>
        
          <div>
            <h4 className="site-footer-heading">Quick Links</h4>
            <ul className="site-footer-list">
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/about">About Us</a></li>
            </ul>
          </div>
        
          <div>
            <h4 className="site-footer-heading">Contact Us</h4>
            <ul className="site-footer-contact">
              <li>
                <MapPin size={20} />
                <span>{settings.contact_address || 'Nairobi, Kenya'}</span>
              </li>
              <li>
                <Phone size={20} />
                <span>{settings.contact_phone || '+254 742 167 151'}</span>
              </li>
              <li>
                <Mail size={20} />
                <a href={`mailto:${settings.contact_email || 'info@doyinkenya.com'}`}>{settings.contact_email || 'info@doyinkenya.com'}</a>
              </li>
            </ul>
          </div>
        </div>
      
        <div className="site-footer-bottom">
          <p>&copy; {new Date().getFullYear()} Doyin Pumps Kenya. All rights reserved.</p>
          <p>
            Created by{' '}
            <a
              href="https://wa.me/254731316717"
              target="_blank"
              rel="noopener noreferrer"
            >
              XLCH3MIST
            </a>
          </p>
          <div className="site-footer-social">
            <a href={settings.facebook_url || '#'} target="_blank" rel="noreferrer">Facebook</a>
            <a href={settings.instagram_url || '#'} target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
