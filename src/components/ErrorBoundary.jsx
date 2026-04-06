import React from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
      // Log the error to our backend as a bug report automatically
      try {
        const errorData = `Auto-Detected Bug:\nMessage: ${error.message}\nStack: ${errorInfo.componentStack}`;
        axios.post(`${API_BASE_URL}/public/interactions`, {
          type: 'issue',
          name: 'System Auto-Tracker',
          content: errorData.substring(0, 5000) // Ensure it fits in the field
      });
    } catch (e) {
      console.error('Failed to report issue', e);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>Our team has been automatically notified of this issue.</p>
          <button 
            style={{ padding: '0.75rem 1.5rem', background: 'var(--clr-brand-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
