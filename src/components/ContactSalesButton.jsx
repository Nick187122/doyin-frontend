import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Phone, ChevronDown } from 'lucide-react';
import './ContactSalesButton.css';

export const CONTACT_PHONE = '0742167151';
export const CONTACT_PHONE_PRETTY = '0742 167 151';

const WHATSAPP_NUMBER = '254742167151';
const TEL_HREF = 'tel:+254742167151';

const ContactSalesButton = ({ className = '', label = 'Contact Sales', message, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    if (onNavigate) onNavigate();
  };

  const whatsappHref = message
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <div className="contact-sales" ref={wrapperRef} data-open={isOpen}>
      <button
        type="button"
        className={className}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="contact-sales-caret" size={16} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="contact-sales-menu" role="menu" aria-label="Contact sales options">
          <a
            className="contact-sales-option contact-sales-whatsapp"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={close}
          >
            <span className="contact-sales-option-icon" aria-hidden="true">
              <MessageCircle size={18} />
            </span>
            <span className="contact-sales-option-text">
              <strong>WhatsApp</strong>
              <small>Chat with sales</small>
            </span>
          </a>

          <a
            className="contact-sales-option contact-sales-call"
            href={TEL_HREF}
            role="menuitem"
            onClick={close}
          >
            <span className="contact-sales-option-icon" aria-hidden="true">
              <Phone size={18} />
            </span>
            <span className="contact-sales-option-text">
              <strong>Call {CONTACT_PHONE_PRETTY}</strong>
              <small>Speak to a sales rep</small>
            </span>
          </a>
        </div>
      )}
    </div>
  );
};

export default ContactSalesButton;