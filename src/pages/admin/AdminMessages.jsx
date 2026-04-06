import React, { useState, useEffect } from 'react';
import { Mail, AlertTriangle, Check, Trash2, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import './AdminMessages.css';

const AdminMessages = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('message');

  const fetchInteractions = async () => {
    setLoading(true);

    try {
      const res = await api.get('/interactions');
      setInteractions(res.data);
    } catch (err) {
      console.error('Failed to fetch interactions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/interactions/${id}/read`);
      setInteractions((current) =>
        current.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const deleteInteraction = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      await api.delete(`/interactions/${id}`);
      setInteractions((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to clear ALL messages and notifications?')) return;

    try {
      await api.post('/interactions/clear');
      setInteractions([]);
    } catch (err) {
      console.error('Failed to clear all', err);
    }
  };

  const filtered = interactions.filter((item) => item.type === activeTab);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Messages & Alerts</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={fetchInteractions} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button className="btn btn-danger" onClick={clearAll}>
            <Trash2 size={18} /> Clear All
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'message' ? 'active' : ''}`}
          onClick={() => setActiveTab('message')}
        >
          <Mail size={18} /> Inquiries / Messages
        </button>
        <button
          className={`tab-btn ${activeTab === 'issue' ? 'active' : ''}`}
          onClick={() => setActiveTab('issue')}
        >
          <AlertTriangle size={18} /> User Alerts / Bugs
        </button>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading-state">Loading data...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">No {activeTab}s found.</div>
        ) : (
          <div className="message-list">
            {filtered.map((item) => (
              <div key={item.id} className={`message-card ${item.is_read ? 'read' : 'unread'}`}>
                <div className="message-header">
                  <div className="message-info">
                    <strong>{item.name || 'Anonymous User'}</strong>
                    {item.email && <span className="message-email">({item.email})</span>}
                  </div>
                  <div className="message-date">{new Date(item.created_at).toLocaleString()}</div>
                </div>

                <div className="message-body">
                  <p>{item.content}</p>
                </div>

                <div className="message-actions">
                  {!item.is_read && (
                    <button
                      className="btn-icon text-success"
                      onClick={() => markAsRead(item.id)}
                      title="Mark as Read"
                    >
                      <Check size={18} /> Mark Read
                    </button>
                  )}
                  <button
                    className="btn-icon text-danger"
                    onClick={() => deleteInteraction(item.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
