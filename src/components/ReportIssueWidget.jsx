import React, { useState } from 'react';
import { AlertCircle, X, CheckCircle, Send } from 'lucide-react';
import api from '../services/api';
import './ReportIssueWidget.css';

const ReportIssueWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ content: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.content.trim()) return;

    setStatus('loading');

    try {
      await api.post('/public/interactions', {
        type: 'issue',
        content: form.content,
      });

      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setForm({ content: '' });
      }, 3000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="report-issue-widget">
      {isOpen ? (
        <div className="report-popover glass">
          <div className="report-header">
            <h4>Report an Issue</h4>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="report-body">
            {status === 'success' ? (
              <div className="report-success">
                <CheckCircle size={32} color="var(--clr-success)" />
                <p>Thank you! We've received your feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p>Find a bug or issue? Please let us know so we can fix it.</p>
                <textarea
                  placeholder="Describe the issue... (e.g. Image not loading, broken link)"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                  rows={4}
                />
                {status === 'error' && <span className="report-error">Something went wrong. Try again.</span>}
                <button type="submit" className="btn btn-primary submit-btn" disabled={status === 'loading' || !form.content.trim()}>
                  {status === 'loading' ? 'Submitting...' : <><Send size={16} /> Submit Issue</>}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <button
          className="report-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Report an Issue"
        >
          <AlertCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ReportIssueWidget;
