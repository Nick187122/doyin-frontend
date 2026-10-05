import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import './WhatsAppButton.css';

const WHATSAPP_NUMBER = '254742167151';

const WhatsAppButton = ({ productName, categoryName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getQuickMessage = (template) => {
    const product = productName || '';
    const category = categoryName || '';
    const templates = {
      general: `Hello Doyin Pumps, I would like to enquire about your products.`,
      product: `Hello Doyin Pumps, I am interested in ${product}${category ? ` (Category: ${category})` : ''}. Is it in stock? Please share pricing and availability.`,
      quote: `Hello Doyin Pumps, I need a quote for ${product}. Please share specifications, pricing, and lead time.`,
    };
    return templates[template] || templates.general;
  };

  const openWhatsApp = (message) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="whatsapp-fab-container">
      {isOpen && (
        <div className="whatsapp-popup">
          <div className="whatsapp-popup-header">
            <MessageCircle size={18} color="white" />
            <span>Chat with us on WhatsApp</span>
            <button onClick={() => setIsOpen(false)} className="whatsapp-popup-close">
              <X size={16} />
            </button>
          </div>
          <div className="whatsapp-popup-body">
            <p>How would you like to proceed?</p>
            {productName && (
              <>
                <button
                  className="whatsapp-popup-btn"
                  onClick={() => openWhatsApp(getQuickMessage('product'))}
                >
                  <span className="whatsapp-popup-btn-icon">📦</span>
                  <div>
                    <strong>Ask about this product</strong>
                    <span>{productName}</span>
                  </div>
                </button>
                <button
                  className="whatsapp-popup-btn"
                  onClick={() => openWhatsApp(getQuickMessage('quote'))}
                >
                  <span className="whatsapp-popup-btn-icon">💰</span>
                  <div>
                    <strong>Request a quote</strong>
                    <span>Get pricing & specs</span>
                  </div>
                </button>
              </>
            )}
            <button
              className="whatsapp-popup-btn"
              onClick={() => openWhatsApp(getQuickMessage('general'))}
            >
              <span className="whatsapp-popup-btn-icon">💬</span>
              <div>
                <strong>General enquiry</strong>
                <span>Talk to sales</span>
              </div>
            </button>
          </div>
        </div>
      )}

      <button
        className="whatsapp-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default WhatsAppButton;
