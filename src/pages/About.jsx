import React, { useState } from 'react';
import { Target, Users, ShieldCheck, Zap } from 'lucide-react';
import { usePublicSite } from '../context/PublicSiteContext';
import api, { API_ORIGIN } from '../services/api';
import Seo from '../components/Seo';

const About = () => {
  const { settings } = usePublicSite();
  const aboutImage = settings.about_image || null;
  const aboutVideo = settings.about_video_url || null;

  const getEmbedUrl = (url) => {
    if (!url) return null;
    let embedUrl = url;
    let isYoutube = false;
    
    if(url.includes('youtube.com/watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/').split('&')[0];
      isYoutube = true;
    } else if(url.includes('youtu.be/')) {
      embedUrl = url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
      isYoutube = true;
    } else if(url.includes('vimeo.com/')) {
      embedUrl = url.replace('vimeo.com/', 'player.vimeo.com/video/');
      embedUrl += embedUrl.includes('?') ? '&autoplay=1&muted=1&loop=1' : '?autoplay=1&muted=1&loop=1';
    }

    if (isYoutube) {
      embedUrl += embedUrl.includes('?') ? '&autoplay=1&mute=1&vq=hd1080' : '?autoplay=1&mute=1&vq=hd1080';
    }
    
    return embedUrl;
  };

  return (
    <div className="section-padding" style={{ paddingBottom: '0' }}>
      <Seo
        title="About Doyin Pumps Kenya | Pump Engineering and Water Solutions"
        description="Learn about Doyin Pumps Kenya, our mission, engineering values, and our water pump and industrial fluid solutions across East Africa."
        path="/about"
      />
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--clr-text-main) 0%, var(--clr-brand-primary) 100%)', 
        color: 'var(--clr-text-inverse)', 
        padding: '6rem 2rem', 
        textAlign: 'center',
        marginBottom: '4rem'
      }}>
        <div className="container">
          <h1 style={{ color: 'var(--clr-text-inverse)', fontSize: '3rem', marginBottom: '1rem' }}>About Doyin Pumps Kenya</h1>
          <p style={{ color: 'var(--clr-surface-metallic)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
            Pioneering fluid mechanics and industrial engineering solutions across East Africa. We specialize in robust, deep-well submersible water pumps that drive communities and industries forward.
          </p>
        </div>
      </section>

      {/* Core Values / Features */}
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2>Our Core Values</h2>
          <p style={{ color: 'var(--clr-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            We are driven by a commitment to quality, performance, and long-lasting partnerships in every project we undertake.
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ background: 'rgba(2, 101, 192, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--clr-brand-primary)' }}>
              <Target size={32} />
            </div>
            <h3>Precision Engineering</h3>
            <p style={{ color: 'var(--clr-text-muted)' }}>
              Our products are designed with meticulous attention to detail, ensuring optimal fluid dynamics and long operational lifespans.
            </p>
          </div>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ background: 'rgba(2, 101, 192, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--clr-brand-primary)' }}>
              <Zap size={32} />
            </div>
            <h3>High Performance</h3>
            <p style={{ color: 'var(--clr-text-muted)' }}>
              Built for robust environments, our submersible pumps deliver exceptional efficiency and power output.
            </p>
          </div>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ background: 'rgba(2, 101, 192, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--clr-brand-primary)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3>Reliability</h3>
            <p style={{ color: 'var(--clr-text-muted)' }}>
              Tested under rigorous conditions, our solutions provide uninterrupted service even in demanding industrial applications.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ background: 'rgba(2, 101, 192, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--clr-brand-primary)' }}>
              <Users size={32} />
            </div>
            <h3>Community Centric</h3>
            <p style={{ color: 'var(--clr-text-muted)' }}>
              We dedicate our resources to improving water access and industrial capabilities, directly impacting local communities.
            </p>
          </div>
        </div>
      </section>

      {/* Story / Mission Section */}
      <section style={{ background: 'var(--clr-surface-light)', padding: '5rem 0', borderTop: '1px solid var(--clr-border)', borderBottom: '1px solid var(--clr-border)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--clr-text-main)' }}>Our Mission & Vision</h2>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              At Doyin Pumps Kenya, we believe that access to reliable water and efficient fluid mechanics infrastructure is the backbone of modern development.
            </p>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              Our mission is to supply state-of-the-art submersible pumps and engineering solutions that exceed industry standards. With years of expertise in East Africa, we understand the specific environmental and industrial challenges of the region, and we engineer our solutions to overcome them effortlessly.
            </p>
            <a href="/products" className="btn btn-primary" style={{ display: 'inline-flex', padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Explore Our Products
            </a>
          </div>
          <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            {aboutVideo ? (
              <div style={{ width: '100%', maxWidth: '560px', aspectRatio: '16/9', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={getEmbedUrl(aboutVideo)} 
                  title="Doyin Pumps Kenya Showcase" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : aboutImage ? (
              <div style={{ width: '100%', maxWidth: '500px', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'var(--clr-surface-metallic)' }}>
                <img 
                  src={`${API_ORIGIN}${aboutImage}`} 
                  alt="Doyin Pumps Kenya Industrial Pump" 
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 0
                  }} 
                />
              </div>
            ) : (
              <div style={{ 
                width: '100%', 
                maxWidth: '500px',
                aspectRatio: '4/3', 
                background: 'linear-gradient(135deg, var(--clr-surface-metallic) 0%, #cbd5e1 100%)', 
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <p style={{ color: 'var(--clr-text-muted)', fontWeight: '600' }}>[ Industrial Pump Image ]</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section className="container" style={{ padding: '5rem 0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--clr-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--clr-border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Get in Touch</h2>
            <p style={{ color: 'var(--clr-text-muted)' }}>Have a question about our products or services? Send us a message.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Warehouse Location Map */}
      <section style={{ background: 'var(--clr-surface-light)', borderTop: '1px solid var(--clr-border)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Our Warehouse Location</h2>
            <p style={{ color: 'var(--clr-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
              Come visit us! We are based in Nairobi, Kenya. Find us on the map below.
            </p>
          </div>
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--clr-border)',
            maxWidth: '900px',
            margin: '0 auto',
            aspectRatio: '16/7',
          }}>
            <iframe
              title="Doyin Pumps Kenya Warehouse Location"
              src="https://www.google.com/maps/place/Omega+Business+Park/@-1.2418612,36.8807557,17z/data=!4m6!3m5!1s0x182f151501a7b933:0xdcd215fc3c632fd5!8m2!3d-1.2419142!4d36.8809205!16s%2Fg%2F11m_j7zh1y?hl=en&entry=ttu&g_ep=EgoyMDI2MDQyNi4wIKXMDSoASAFQAw%3D%3D"
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


const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '1rem' }}>
          <ShieldCheck size={32} />
        </div>
        <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Message Sent!</h3>
        <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Thank you for reaching out. Our team will get back to you shortly.</p>
        <button className="btn btn-outline" onClick={() => setStatus('idle')}>Send Another Message</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group">
        <label>Your Name</label>
        <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
      </div>
      <div className="form-group">
        <label>Message</label>
        <textarea required rows={5} value={form.content} onChange={e => setForm({...form, content: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)', fontFamily: 'inherit' }}></textarea>
      </div>
      {status === 'error' && <p style={{ color: 'var(--clr-brand-secondary)', fontSize: '0.9rem', margin: 0 }}>Something went wrong. Please try again.</p>}
      <button type="submit" className="btn btn-primary" disabled={status === 'loading'} style={{ marginTop: '0.5rem', width: '100%' }}>
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

export default About;
