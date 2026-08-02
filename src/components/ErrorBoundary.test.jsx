import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Mock axios to prevent network errors from componentDidCatch
// Must include create() since api.js calls axios.create during import
vi.mock('axios', () => {
  const mockAxiosInstance = {
    post: vi.fn().mockResolvedValue({ data: {} }),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn(() => () => {}), eject: vi.fn() },
    },
  };

  return {
    default: {
      ...mockAxiosInstance,
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

// A component that throws an error
function BuggyComponent() {
  throw new Error('Test error');
}

function GoodComponent() {
  return <div>Everything is fine</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error for the error boundary test
  const originalError = console.error;

  beforeEach(() => {
    console.error = () => {};
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Everything is fine')).toBeDefined();
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeDefined();
    expect(screen.getByText('Our team has been automatically notified of this issue.')).toBeDefined();
  });
});
