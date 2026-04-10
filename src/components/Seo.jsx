import { useEffect } from 'react';

const DEFAULT_TITLE = 'Doyin Pumps Kenya | Submersible Water Pumps and Industrial Pump Solutions';
const DEFAULT_DESCRIPTION = 'Doyin Pumps Kenya supplies submersible water pumps, borehole pumps, accessories, and industrial fluid handling solutions across Kenya.';
const DEFAULT_OG_IMAGE = '/images/logo.jpg';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value == null) {
      element.removeAttribute(key);
      return;
    }

    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function buildRobotsValue({ noindex, nofollow }) {
  if (!noindex && !nofollow) return 'index, follow';

  return [noindex ? 'noindex' : 'index', nofollow ? 'nofollow' : 'follow'].join(', ');
}

const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  nofollow = false,
}) => {
  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = new URL(path, origin).href;
    const imageUrl = new URL(image, origin).href;
    const robots = buildRobotsValue({ noindex, nofollow });

    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Doyin Pumps Kenya' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
  }, [description, image, nofollow, noindex, path, title, type]);

  return null;
};

export default Seo;
