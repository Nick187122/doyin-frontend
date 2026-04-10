import { mkdir, writeFile } from 'node:fs/promises';

const SITE_URL = (process.env.SITE_URL || 'https://doyin-kenya.com').replace(/\/+$/, '');
const API_BASE_URL = (process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '');
const OUTPUT_DIR = new URL('../public/', import.meta.url);
const OUTPUT_FILE = new URL('../public/sitemap.xml', import.meta.url);

const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
];

async function fetchProducts() {
  const url = `${API_BASE_URL}/public/products`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Unexpected status ${response.status}`);
    }

    const products = await response.json();
    if (!Array.isArray(products)) {
      throw new Error('Product payload was not an array');
    }

    return products
      .filter((product) => product?.id != null)
      .map((product) => ({
        path: `/products/${product.id}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : today,
      }));
  } catch (error) {
    console.warn(`[sitemap] Failed to fetch products from ${url}. Falling back to static routes only.`);
    console.warn(`[sitemap] ${error.message}`);
    return [];
  }
}

function renderUrl({ path, changefreq, priority, lastmod = today }) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

async function main() {
  const productRoutes = await fetchProducts();
  const urls = [...staticRoutes, ...productRoutes];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(renderUrl),
    '</urlset>',
    '',
  ].join('\n');

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, xml, 'utf8');

  console.log(`[sitemap] Wrote ${urls.length} URL(s) to ${OUTPUT_FILE.pathname}`);
}

main().catch((error) => {
  console.error('[sitemap] Failed to generate sitemap.');
  console.error(error);
  process.exitCode = 1;
});
