import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { loadEnv } from 'vite';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, '..');
const execFileAsync = promisify(execFile);
const mode = process.env.NODE_ENV || 'production';
const env = loadEnv(mode, PROJECT_ROOT, '');

const SITE_URL = (env.SITE_URL || process.env.SITE_URL || 'https://doyin-kenya.com').replace(/\/+$/, '');
const API_BASE_URL = (
  env.SITEMAP_API_BASE_URL
  || env.VITE_API_BASE_URL
  || process.env.SITEMAP_API_BASE_URL
  || process.env.VITE_API_BASE_URL
  || 'https://doyin-kenya.duckdns.org/api'
).replace(/\/+$/, '');
const OUTPUT_DIR = new URL('../public/', import.meta.url);
const OUTPUT_FILE = new URL('../public/sitemap.xml', import.meta.url);
const LOCAL_PRODUCT_EXPORT_SCRIPT = resolve(PROJECT_ROOT, '../doyin-backend/query_products.php');
const SITEMAP_PRODUCTS_ENDPOINT = '/public/sitemap/products';

const today = new Date().toISOString().split('T')[0];
const isLocalApi = (value = '') => /localhost|127\.0\.0\.1/i.test(value);

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
];

async function fetchProducts() {
  const resolvedApiBaseUrl = mode === 'production' && isLocalApi(API_BASE_URL)
    ? 'https://doyin-kenya.duckdns.org/api'
    : API_BASE_URL;
  const sitemapUrl = `${resolvedApiBaseUrl}${SITEMAP_PRODUCTS_ENDPOINT}`;
  const fallbackProductsUrl = `${resolvedApiBaseUrl}/public/products`;

  try {
    const response = await fetch(sitemapUrl, {
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
    console.warn(`[sitemap] Failed to fetch sitemap products from ${sitemapUrl}.`);
    console.warn(`[sitemap] ${error.message}`);
  }

  try {
    const response = await fetch(fallbackProductsUrl, {
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
    console.warn(`[sitemap] Failed to fetch public products from ${fallbackProductsUrl}.`);
    console.warn(`[sitemap] ${error.message}`);
  }

  if (existsSync(LOCAL_PRODUCT_EXPORT_SCRIPT)) {
    console.warn('[sitemap] Falling back to local product export script.');
    return fetchProductsFromLocalExport();
  }

  console.warn('[sitemap] No remote or local product source was available. Using static routes only.');
  return [];
}

async function fetchProductsFromLocalExport() {
  if (!existsSync(LOCAL_PRODUCT_EXPORT_SCRIPT)) {
    return [];
  }

  try {
    const { stdout } = await execFileAsync('php', [LOCAL_PRODUCT_EXPORT_SCRIPT], {
      cwd: PROJECT_ROOT,
    });

    return stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [id, updatedAt] = line.split('|');
        const lastmod = updatedAt ? new Date(updatedAt).toISOString().split('T')[0] : today;

        return {
          path: `/products/${id}`,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod,
        };
      });
  } catch (error) {
    console.warn('[sitemap] Local product export fallback also failed.');
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

  if (productRoutes.length === 0) {
    console.warn('[sitemap] Product URLs were not included. Check SITEMAP_API_BASE_URL or VITE_API_BASE_URL for the build environment.');
  }

  console.log(`[sitemap] Wrote ${urls.length} URL(s) to ${OUTPUT_FILE.pathname}`);
}

main().catch((error) => {
  console.error('[sitemap] Failed to generate sitemap.');
  console.error(error);
  process.exitCode = 1;
});
