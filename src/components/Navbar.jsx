import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import ContactSalesButton from './ContactSalesButton';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.jpg" alt="Doyin Pumps Kenya logo" className="logo-image" />
        </Link>
        
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <NavLink to="/" end onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setIsOpen(false)}>Products</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)}>About Us</NavLink>
          <ContactSalesButton
            className="navbar-cta navbar-cta-trigger"
            onNavigate={() => setIsOpen(false)}
          />
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
