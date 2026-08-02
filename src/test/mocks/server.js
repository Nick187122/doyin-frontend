import { vi } from 'vitest';

// Mock the API module for all tests
vi.mock('../../services/api', () => {
  const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn(() => () => {}), eject: vi.fn() },
    },
  };

  return {
    default: mockAxios,
    AUTH_TOKEN_KEY: 'admin_token',
    DEVICE_TOKEN_KEY: 'device_token',
    API_BASE_URL: 'https://test.example.com/api',
    API_ORIGIN: 'https://test.example.com',
  };
});
