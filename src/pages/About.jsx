import { useState } from 'react';
import { Target, Users, ShieldCheck, Zap } from 'lucide-react';
import { usePublicSite } from '../context/PublicSiteContext';
import api, { API_ORIGIN } from '../services/api';
import Seo from '../components/Seo';
import './About.css';

const values = [
  {
    icon: Target,
    title: 'Precision Engineering',
    copy: 'Our products are designed with careful attention to performance, hydraulic efficiency, and long operational life.',
  },
  {
    icon: Zap,
    title: 'High Performance',
    copy: 'Built for robust environments, our pump systems deliver dependable power for industrial and agricultural use cases.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliability',
    copy: 'We prioritize equipment and support that can stand up to real field conditions over time.',
  },
  {
    icon: Users,
    title: 'Community Centric',
    copy: 'Our work contributes directly to better water access, productive farms, and stronger local infrastructure.',
  },
];

const getEmbedUrl = (url) => {
  if (!url) return null;

  let embedUrl = url;
  let isYoutube = false;

  if (url.includes('youtube.com/watch?v=')) {
    embedUrl = url.replace('watch?v=', 'embed/').split('&')[0];
    isYoutube = true;
  } else if (url.includes('youtu.be/')) {
    embedUrl = url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
    isYoutube = true;
  } else if (url.includes('vimeo.com/')) {
    embedUrl = url.replace('vimeo.com/', 'player.vimeo.com/video/');
    embedUrl += embedUrl.includes('?') ? '&autoplay=1&muted=1&loop=1' : '?autoplay=1&muted=1&loop=1';
  }

  if (isYoutube) {
    embedUrl += embedUrl.includes('?') ? '&autoplay=1&mute=1&vq=hd1080' : '?autoplay=1&mute=1&vq=hd1080';
  }

  return embedUrl;
};

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');

    try {
      await api.post('/public/interactions', { ...form, type: 'message' });
      setStatus('success');
      setForm({ name: '', email: '', content: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="about-success">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            marginBottom: '1rem',
          }}
        >
          <ShieldCheck size={32} />
        </div>
        <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Message Sent</h3>
        <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>
          Thank you for reaching out. Our team will get back to you shortly.
        </p>
        <button className="btn btn-outline" onClick={() => setStatus('idle')}>Send Another Message</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="about-form">
      <div>
        <label htmlFor="name">Your Name</label>
        <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" required rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </div>
      {status === 'error' && <p style={{ color: '#b03939', fontSize: '0.9rem', margin: 0 }}>Something went wrong. Please try again.</p>}
      <button type="submit" className="btn btn-primary" disabled={status === 'loading'} style={{ width: '100%' }}>
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

const About = () => {
  const { settings } = usePublicSite();
  const aboutImage = settings.about_image || null;
  const aboutVideo = settings.about_video_url || null;

  return (
    <div className="about-page">
      <Seo
        title="About Doyin Pumps Kenya | Pump Engineering and Water Solutions"
        description="Learn about Doyin Pumps Kenya, our mission, engineering values, and our water pump and industrial fluid solutions across East Africa."
        path="/about"
      />

      <section className="about-hero">
        <div className="container about-hero-copy">
          <div className="eyebrow">About Doyin</div>
          <h1 style={{ color: 'var(--clr-text-inverse)' }}>Water movement, engineering discipline, and regional trust.</h1>
          <p className="section-copy" style={{ color: 'rgba(231, 240, 248, 0.8)' }}>
            Doyin Pumps Kenya supplies pump systems and fluid-handling solutions designed for demanding borehole, agricultural, domestic, and industrial applications.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <div className="home-section-heading text-center">
            <div className="eyebrow">Core Values</div>
            <h2>What guides the business.</h2>
            <p className="section-copy home-section-copy">
              The operational focus remains the same: performance, durability, and practical support for clients across East Africa.
            </p>
          </div>

          <div className="about-values-grid">
            {values.map((item) => {
              const IconComponent = item.icon;

              return (
                <div key={item.title} className="card about-value-card">
                <div className="about-value-icon">
                    <IconComponent size={28} />
                </div>
                  <h3>{item.title}</h3>
                  <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8 }}>{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story-grid">
          <div>
            <div className="eyebrow">Mission and Vision</div>
            <h2>Built around reliable water infrastructure.</h2>
            <p className="section-copy" style={{ marginBottom: '1rem' }}>
              At Doyin Pumps Kenya, we believe that dependable water systems are foundational to modern development, productive farms, and resilient communities.
            </p>
            <p className="section-copy" style={{ marginBottom: '1.8rem' }}>
              Our mission is to supply high-quality submersible pumps and engineering solutions that meet real operating conditions in East Africa. We focus on products and guidance that improve confidence before purchase and reliability after installation.
            </p>
            <a href="/products" className="btn btn-primary">
              Explore Our Products
            </a>
          </div>

          <div>
            {aboutVideo ? (
              <div className="about-media-frame video">
                <iframe
                  src={getEmbedUrl(aboutVideo)}
                  title="Doyin Pumps Kenya Showcase"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : aboutImage ? (
              <div className="about-media-frame image">
                <img
                  src={`${API_ORIGIN}${aboutImage}`}
                  alt="Doyin Pumps Kenya industrial pump"
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'cover', height: '100%' }}
                />
              </div>
            ) : (
              <div className="about-media-frame placeholder">
                <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--clr-text-soft)' }}>
                  <span>Industrial pump showcase</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="about-contact">
        <div className="container">
          <div className="card about-contact-card">
            <div className="text-center" style={{ marginBottom: '2rem' }}>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>Contact</div>
              <h2>Get in touch.</h2>
              <p className="section-copy home-section-copy">Have a question about our products or services? Send us a message.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="about-map">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Location</div>
            <h2>Our warehouse location.</h2>
            <p className="section-copy home-section-copy">
              We are based in Nairobi, Kenya. Visit us or use the map below to locate the warehouse.
            </p>
          </div>
          <div className="about-map-frame">
            <iframe
              title="Doyin Pumps Kenya Warehouse Location"
              src="https://maps.google.com/maps?q=-1.2419142,36.8809205&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
