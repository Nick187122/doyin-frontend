import { NavLink } from 'react-router-dom';
import { Home, Package, Search, MessageCircle } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className="bottom-nav-item">
        <Home size={20} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/products" className="bottom-nav-item">
        <Package size={20} />
        <span>Products</span>
      </NavLink>
      <NavLink to="/products" className="bottom-nav-item" onClick={(e) => {
        e.preventDefault();
        const el = document.querySelector('.products-toolbar input');
        if (el) {
          window.location.href = '/products';
          setTimeout(() => el.focus(), 300);
        } else {
          window.location.href = '/products';
        }
      }}>
        <Search size={20} />
        <span>Search</span>
      </NavLink>
      <a
        href="https://wa.me/254742167151"
        className="bottom-nav-item whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
};

export default BottomNav;
