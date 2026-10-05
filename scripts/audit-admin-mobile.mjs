import { mkdirSync } from 'node:fs';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    'This audit needs Playwright, which is not a project dependency.\n' +
      'Install it on demand, then run the audit against a dev server:\n\n' +
      '  npm i -D playwright && npx playwright install chromium\n' +
      '  npm run dev\n' +
      '  BASE_URL=http://localhost:5173 npm run audit:admin-mobile\n'
  );
  process.exit(1);
}

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const OUT = process.env.OUT_DIR || 'screenshots';
mkdirSync(OUT, { recursive: true });

const products = [
  {
    id: 1,
    name: 'Doyin Submersible Pump 2HP Model XZ-45',
    description: 'Heavy duty stainless steel submersible pump designed for deep boreholes up to 120 metres with integrated thermal protection.',
    price: 48500,
    category: { name: 'Submersible Pumps' },
    max_flow_rate: '120 L/min',
    max_height: '80m',
    recommended_depth: '30-60m',
    ideal_power: '1.5 kW / 2HP',
    in_stock: true,
    views_count: 412,
    image_url: '/images/logo.jpg',
  },
  {
    id: 2,
    name: 'Solar Surface Pump 1HP',
    description: 'Complete solar pumping system.',
    price: 92000,
    category: { name: 'Solar Pumps' },
    max_flow_rate: '60 L/min',
    max_height: '45m',
    recommended_depth: '20-30m',
    ideal_power: '0.75 kW / 1HP',
    in_stock: false,
    views_count: 288,
    image_url: '/images/logo.jpg',
  },
  {
    id: 3,
    name: 'Pressure Control Valve 2 inch',
    description: 'Adjustable brass pressure control valve.',
    price: 4500,
    category: { name: 'Accessories' },
    in_stock: true,
    views_count: 76,
    image_url: null,
  },
  {
    id: 4,
    name: 'Borehole Pressure Tank 100L',
    description: 'Pre-charged pressure vessel for storage tanks.',
    price: 28500,
    category: { name: 'Accessories' },
    in_stock: true,
    views_count: 54,
    image_url: null,
  },
];

const categories = [
  { id: 1, name: 'Submersible Pumps', is_pump: true, has_ideal_power: true, products_count: 12 },
  { id: 2, name: 'Solar Pumps', is_pump: true, has_ideal_power: true, products_count: 5 },
  { id: 3, name: 'Accessories', is_pump: false, has_ideal_power: false, products_count: 31 },
  { id: 4, name: 'Industrial Pumps', is_pump: true, has_ideal_power: true, products_count: 8 },
];

const interactions = [
  { id: 1, type: 'message', name: 'Joseph Mwangi', email: 'jmwangi@example.co.ke', content: 'I need a 3HP submersible pump for a 90m borehole in Kitale. What is the best model?', is_read: false, created_at: '2026-03-02T09:15:00Z' },
  { id: 2, type: 'message', name: 'Mary Achieng', email: 'mary@example.co.ke', content: 'Do you deliver to Nakuru and what is the delivery cost?', is_read: false, created_at: '2026-03-01T16:40:00Z' },
  { id: 3, type: 'issue', name: 'Anonymous', email: null, content: 'The WhatsApp button overlaps the product filter on my phone.', is_read: false, created_at: '2026-02-28T11:05:00Z' },
];

const testimonials = [
  { id: 1, name: 'Grace Njeri', title: 'Farm Manager', company: 'Green Valley Farm', content: 'Doyin Pumps supplied and installed six submersible pumps for our irrigation system. The team was professional and the delivery was on time.', rating: 5, is_visible: true, sort_order: 1, avatar_url: null, video_url: null },
  { id: 2, name: 'Samuel Otieno', title: 'Contractor', company: 'Otieno Contractors', content: 'Good quality pumps and very responsive technical support. Highly recommended for borehole installations.', rating: 5, is_visible: false, sort_order: 2, avatar_url: null, video_url: null },
];

const salespersons = [
  { id: 1, name: 'Brian Kimani', phone_number: '254712345678', is_active: true },
  { id: 2, name: 'Linda Chebet', phone_number: '254798765432', is_active: true },
];

const settings = {
  store_name: 'Doyin Pumps Kenya',
  contact_email: 'admin@doyinkenya.com',
  contact_phone: '+254 742 167 151',
  contact_address: 'Nairobi, Kenya',
  facebook_url: '',
  instagram_url: '',
  about_video_url: '',
  about_image: '/images/logo.jpg',
  homepage_new_arrivals_enabled: '1',
  homepage_new_arrivals_badge: 'New Arrivals',
  homepage_new_arrivals_title: 'Fresh stock ready for specification.',
  homepage_new_arrivals_copy: 'Discover the latest additions to the catalog.',
  homepage_new_arrivals_count: '4',
  homepage_new_arrivals_category_id: '',
  homepage_featured_products_enabled: '1',
  homepage_featured_products_badge: 'Featured Products',
  homepage_featured_products_title: 'Priority models we want customers to see first.',
  homepage_featured_products_copy: 'Hand-picked products from the catalog.',
  homepage_featured_product_ids: '1,2',
};

const heroImages = [
  { id: 1, title: 'Quality Pumps', order: 1, is_active: true, image_path: '/images/logo.jpg' },
  { id: 2, title: 'Solar Systems', order: 2, is_active: false, image_path: '/images/logo.jpg' },
  { id: 3, title: 'Borehole Drilling', order: 3, is_active: true, image_path: '/images/logo.jpg' },
];

function jsonFor(url) {
  const path = url.replace(/^https?:\/\/[^/]+/i, '').split('?')[0];
  if (path.endsWith('/me')) return { user: { id: 1, name: 'Admin User', email: 'admin@doyinkenya.com' }, must_change_password: false };
  if (path.endsWith('/products') || path.endsWith('/public/products')) return products;
  if (path.endsWith('/categories') || path.endsWith('/public/categories')) return categories;
  if (path.endsWith('/interactions')) return interactions;
  if (path.endsWith('/testimonials')) return testimonials;
  if (path.endsWith('/salespersons')) return salespersons;
  if (path.endsWith('/public/settings')) return settings;
  if (path.endsWith('/settings')) return { message: 'ok' };
  if (path.endsWith('/hero-images')) return heroImages;
  return {};
}

const viewports = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const pages = [
  { name: 'dashboard', path: '/admin' },
  { name: 'inventory', path: '/admin/inventory' },
  { name: 'categories', path: '/admin/categories' },
  { name: 'messages', path: '/admin/messages' },
  { name: 'testimonials', path: '/admin/testimonials' },
  { name: 'salespersons', path: '/admin/salespersons' },
  { name: 'settings', path: '/admin/settings' },
  { name: 'hero-images', path: '/admin/hero-images' },
];

const browser = await chromium.launch();
const errors = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: vp.name !== 'desktop',
    hasTouch: vp.name !== 'desktop',
  });

  await context.addInitScript(() => {
    sessionStorage.setItem('admin_token', 'test-token');
    sessionStorage.setItem('device_token', 'test-device');
  });

  await context.route('**/api/**', async (route) => {
    const url = route.request().url();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(jsonFor(url)),
    });
  });

  const page = await context.newPage();
  page.on('console', (msg) => {
    const text = msg.text();
    // Google Fonts is unreachable in the sandbox; ignore that and asset 404s.
    if (msg.type() === 'error' && !/ERR_CONNECTION_REFUSED|ERR_NAME_NOT_RESOLVED|fonts\.g/.test(text)) {
      errors.push(`[${vp.name}] console: ${text}`);
    }
  });
  page.on('pageerror', (err) => errors.push(`[${vp.name}] pageerror: ${err.message}`));

  for (const target of pages) {
    await page.goto(`${BASE}${target.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${OUT}/${vp.name}-${target.name}.png`, fullPage: true });

    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return { scrollW: de.scrollWidth, clientW: de.clientWidth };
    });
    if (overflow.scrollW > overflow.clientW + 1) {
      errors.push(`[${vp.name}] ${target.name}: horizontal overflow ${overflow.scrollW} > ${overflow.clientW}`);
    }
  }

  // Drawer open state (the hamburger is intentionally hidden on desktop)
  await page.goto(`${BASE}/admin/inventory`, { waitUntil: 'networkidle' });
  const toggle = page.locator('.admin-menu-toggle');
  const toggleVisible = await toggle.isVisible();
  const expectsToggle = vp.width < 1024;

  if (expectsToggle !== toggleVisible) {
    errors.push(`[${vp.name}] menu toggle visibility ${toggleVisible}, expected ${expectsToggle}`);
  }

  if (expectsToggle) {
    await toggle.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/${vp.name}-drawer-open.png` });

    const drawerOpen = await page.locator('aside.admin-sidebar.open').isVisible();
    if (!drawerOpen) errors.push(`[${vp.name}] drawer did not open`);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const drawerClosed = await page.locator('aside.admin-sidebar.open').count();
    if (drawerClosed !== 0) errors.push(`[${vp.name}] drawer did not close on Escape`);

    // Sidebar must be off-screen once closed
    const box = await page.locator('aside.admin-sidebar').boundingBox();
    if (box && box.x + box.width > 1) {
      errors.push(`[${vp.name}] closed sidebar still on screen at x=${Math.round(box.x)}`);
    }
  }

  await context.close();
}

await browser.close();

if (errors.length) {
  console.log('ISSUES FOUND:');
  for (const e of errors) console.log(' -', e);
  process.exitCode = 1;
} else {
  console.log('No console errors and no horizontal overflow detected.');
}
