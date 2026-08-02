import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReportIssueWidget from './ReportIssueWidget';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
  AUTH_TOKEN_KEY: 'admin_token',
  DEVICE_TOKEN_KEY: 'device_token',
  API_BASE_URL: 'https://test.example.com/api',
  API_ORIGIN: 'https://test.example.com',
}));

describe('ReportIssueWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the report issue toggle button', () => {
    render(<ReportIssueWidget />);
    expect(screen.getByTitle('Report an Issue')).toBeDefined();
  });

  it('opens the form when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<ReportIssueWidget />);

    await user.click(screen.getByTitle('Report an Issue'));
    expect(screen.getByText('Report an Issue')).toBeDefined();
    expect(screen.getByPlaceholderText(/Describe the issue/)).toBeDefined();
  });

  it('can be closed after opening', async () => {
    const user = userEvent.setup();
    render(<ReportIssueWidget />);

    await user.click(screen.getByTitle('Report an Issue'));
    const closeBtn = screen.getByText('Report an Issue').closest('div').querySelector('button');
    if (closeBtn) await user.click(closeBtn);

    expect(screen.queryByText('Report an Issue')).toBeNull();
  });

  it('submits an issue successfully', async () => {
    api.post.mockResolvedValue({ data: { message: 'Submitted successfully' } });

    const user = userEvent.setup();
    render(<ReportIssueWidget />);

    await user.click(screen.getByTitle('Report an Issue'));

    const textarea = screen.getByPlaceholderText(/Describe the issue/);
    await user.type(textarea, 'There is a bug on the homepage');

    await user.click(screen.getByText('Submit Issue'));

    await waitFor(() => {
      expect(screen.getByText(/Thank you/)).toBeDefined();
    });

    expect(api.post).toHaveBeenCalledWith('/public/interactions', {
      type: 'issue',
      content: 'There is a bug on the homepage',
    });
  });
});
