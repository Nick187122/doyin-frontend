import { describe, it, expect, vi, beforeEach } from 'vitest';
import api, { AUTH_TOKEN_KEY, DEVICE_TOKEN_KEY, API_BASE_URL } from './api';

describe('API Service', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('uses the correct base URL', () => {
    expect(api.defaults.baseURL).toBe(API_BASE_URL);
  });

  it('has JSON accept header', () => {
    expect(api.defaults.headers.Accept).toBe('application/json');
  });

  it('exports the auth token key', () => {
    expect(AUTH_TOKEN_KEY).toBe('admin_token');
  });

  it('exports the device token key', () => {
    expect(DEVICE_TOKEN_KEY).toBe('device_token');
  });

  it('includes auth token in request headers when available', () => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, 'test-token');
    sessionStorage.setItem(DEVICE_TOKEN_KEY, 'test-device');

    const config = { headers: {} };
    api.interceptors.request.handlers[0].fulfilled(config);

    expect(config.headers.Authorization).toBe('Bearer test-token');
    expect(config.headers['X-Device-Token']).toBe('test-device');
  });

  it('does not include auth header when no token exists', () => {
    const config = { headers: {} };
    api.interceptors.request.handlers[0].fulfilled(config);

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('clears session and redirects on 401 response', async () => {
    const err = { response: { status: 401 } };

    sessionStorage.setItem(AUTH_TOKEN_KEY, 'old-token');
    sessionStorage.setItem(DEVICE_TOKEN_KEY, 'old-device');

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    await expect(api.interceptors.response.handlers[0].rejected(err)).rejects.toThrow();

    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    expect(sessionStorage.getItem(DEVICE_TOKEN_KEY)).toBeNull();
    expect(window.location.href).toBe('/admin/login');

    window.location = originalLocation;
  });
});
