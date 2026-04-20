import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import api, { API_ORIGIN } from '../../services/api';
import AdminPasswordChangePanel from '../../components/admin/AdminPasswordChangePanel';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    store_name: 'Doyin Pumps Kenya',
    contact_email: 'admin@doyinkenya.com',
    contact_phone: '+254 742 167 151',
    contact_address: 'Nairobi, Kenya',
    facebook_url: '',
    instagram_url: '',
    about_video_url: ''
  });
  const [aboutImage, setAboutImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [aboutImageFile, setAboutImageFile] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/public/settings');
        if (response.data) {
          setAboutImage(response.data.about_image || '');
          setSettings(prev => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      ['store_name', 'contact_email', 'contact_phone', 'contact_address', 'facebook_url', 'instagram_url', 'about_video_url'].forEach(key => {
        if (settings[key] !== null && settings[key] !== undefined) {
          formData.append(`settings[${key}]`, settings[key]);
        }
      });
      
      if (aboutImageFile) {
        formData.append('about_image', aboutImageFile);
      }

      await api.post('/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('Settings saved successfully!');
      setAboutImageFile(null);
      // Re-fetch to update any newly uploaded file paths
      const response = await api.get('/public/settings');
      if (response.data) {
        setAboutImage(response.data.about_image || '');
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error saving settings', error);
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Settings size={32} color="var(--clr-brand-primary)" />
        <h1>System Settings</h1>
      </div>
      <div className="card" style={{ maxWidth: '800px' }}>
        <h3>General Preferences</h3>
        <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Configure main system settings here.</p>
        
        {message && (
          <div style={{ padding: '10px', marginBottom: '1rem', backgroundColor: message.includes('success') ? 'var(--clr-brand-secondary)' : '#ef4444', color: 'black', borderRadius: '4px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Store Name</label>
            <input type="text" name="store_name" value={settings.store_name} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Contact Email</label>
            <input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Contact Phone</label>
            <input type="text" name="contact_phone" value={settings.contact_phone} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Contact Address</label>
            <input type="text" name="contact_address" value={settings.contact_address} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>

          <h4 style={{ marginTop: '1rem', borderTop: '1px solid var(--clr-border)', paddingTop: '1rem' }}>Page Media</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>About Us Image</label>
            {aboutImage && !aboutImageFile && (
              <div style={{ width: '100%', maxWidth: '240px', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.5rem', background: 'var(--clr-surface-metallic)' }}>
                <img src={`${API_ORIGIN}${aboutImage}`} alt="Current About Image" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => setAboutImageFile(e.target.files[0])} style={{ padding: '0.5rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>Leave empty to keep the current image</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>About Us Video URL (YouTube / Vimeo)</label>
            <input type="url" name="about_video_url" value={settings.about_video_url || ''} onChange={handleChange} placeholder="e.g. https://www.youtube.com/watch?v=..." style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>If provided, this HD video will optimally load over the image on the About page.</span>
          </div>
          
          <h4 style={{ marginTop: '1rem', borderTop: '1px solid var(--clr-border)', paddingTop: '1rem' }}>Social Media Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Facebook URL</label>
            <input type="url" name="facebook_url" value={settings.facebook_url} onChange={handleChange} placeholder="https://facebook.com/..." style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600' }}>Instagram URL</label>
            <input type="url" name="instagram_url" value={settings.instagram_url} onChange={handleChange} placeholder="https://instagram.com/..." style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }} />
          </div>

          <div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <AdminPasswordChangePanel
          title="Admin Login Security"
          description="Change the admin password here. Every password update requires a one-time verification code sent to the admin email."
          submitLabel="Change Admin Password"
        />
      </div>
    </div>
  );
};

export default AdminSettings;
