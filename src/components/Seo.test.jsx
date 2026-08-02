import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Seo from './Seo';

describe('Seo', () => {
  it('sets the document title', () => {
    render(
      <Seo
        title="Test Page | Doyin Pumps Kenya"
        description="Test description"
        path="/test"
      />
    );

    expect(document.title).toBe('Test Page | Doyin Pumps Kenya');
  });

  it('creates meta description tag', () => {
    render(
      <Seo
        title="Test"
        description="A meta description for testing."
        path="/"
      />
    );

    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content')).toBe('A meta description for testing.');
  });

  it('sets robots meta for noindex', () => {
    render(
      <Seo
        title="Admin"
        description="Admin page"
        path="/admin"
        noindex
        nofollow
      />
    );

    const robots = document.querySelector('meta[name="robots"]');
    expect(robots).not.toBeNull();
    expect(robots.getAttribute('content')).toContain('noindex');
    expect(robots.getAttribute('content')).toContain('nofollow');
  });

  it('creates OG meta tags', () => {
    render(
      <Seo
        title="Product"
        description="Product page"
        path="/products/1"
        type="product"
        image="/images/pump.jpg"
      />
    );

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    expect(ogTitle.getAttribute('content')).toBe('Product');
    // Seo resolves relative paths to absolute using window.location.origin
    expect(ogImage.getAttribute('content')).toBe('http://localhost:3000/images/pump.jpg');
    expect(ogType.getAttribute('content')).toBe('product');
    expect(ogUrl.getAttribute('content')).toBe('http://localhost:3000/products/1');
  });
});
