import React, { useState, useEffect } from 'react';
import { Image, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import api, { API_ORIGIN } from '../../services/api';

const AdminHeroImages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Form state
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [order, setOrder] = useState(0);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/hero-images');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('is_active', isActive ? 1 : 0);
        formData.append('order', order);

        try {
            await api.post('/hero-images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            setTitle('');
            setOrder(0);
            fetchImages();
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            await api.delete(`/hero-images/${id}`);
            fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const toggleActive = async (image) => {
        try {
            await api.put(`/hero-images/${image.id}`, { is_active: !image.is_active });
            fetchImages();
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Image size={32} color="var(--clr-brand-primary)" />
                <h1>Homepage Images</h1>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Upload New Image</h3>
                <form onSubmit={handleUpload} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Image File *</label>
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Caption (Optional)</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Quality Pumps" style={{ padding: '0.5rem' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Order</label>
                        <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} style={{ padding: '0.5rem', width: '80px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.5rem' }}>
                        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} id="active-cb" />
                        <label htmlFor="active-cb">Active</label>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                        {uploading ? 'Uploading...' : <><Plus size={18} /> Upload Image</>}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3>Current Images</h3>
                {loading ? <p>Loading images...</p> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        {images.map(img => (
                            <div key={img.id} style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                <img src={`${API_ORIGIN}${img.image_path}`} alt={img.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <div style={{ padding: '1rem' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{img.title || 'Untitled'}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>Order: {img.order}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                        <button 
                                            onClick={() => toggleActive(img)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', border: 'none', cursor: 'pointer', background: img.is_active ? 'var(--clr-brand-secondary)' : '#e2e8f0', color: img.is_active ? 'black' : '#64748b' }}
                                        >
                                            {img.is_active ? <Check size={16} /> : <X size={16} />}
                                            {img.is_active ? 'Active' : 'Hidden'}
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(img.id)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHeroImages;
