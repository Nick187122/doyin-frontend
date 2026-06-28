/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const CACHE_KEY = 'public_site_data';
const CACHE_TTL_MS = 5 * 60 * 1000;

const DEFAULT_SETTINGS = {
  facebook_url: '#',
  instagram_url: '#',
  contact_phone: '+254 742 167 151',
  contact_email: 'info@doyinkenya.com',
  contact_address: 'Nairobi, Kenya',
  homepage_new_arrivals_enabled: '1',
  homepage_new_arrivals_badge: 'New Arrivals',
  homepage_new_arrivals_title: 'Fresh stock ready for specification.',
  homepage_new_arrivals_copy: 'Discover the latest additions to the catalog, with current stock status and fast paths to enquiry.',
  homepage_new_arrivals_count: '4',
  homepage_new_arrivals_category_id: '',
  homepage_featured_products_enabled: '1',
  homepage_featured_products_badge: 'Featured Products',
  homepage_featured_products_title: 'Priority models we want customers to see first.',
  homepage_featured_products_copy: 'Hand-picked products from the catalog, curated manually from admin for stronger homepage merchandising.',
  homepage_featured_product_ids: '',
};

const PublicSiteContext = createContext({
  settings: DEFAULT_SETTINGS,
  heroImages: [],
  testimonials: [],
  loading: true,
});

function readCachedPublicSiteData() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed.timestamp || Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function writeCachedPublicSiteData(data) {
  sessionStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  );
}

export function PublicSiteProvider({ children }) {
  const cachedData = readCachedPublicSiteData();
  const [settings, setSettings] = useState(cachedData?.settings || DEFAULT_SETTINGS);
  const [heroImages, setHeroImages] = useState(cachedData?.heroImages || []);
  const [testimonials, setTestimonials] = useState(cachedData?.testimonials || []);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    let cancelled = false;

    const fetchPublicSiteData = async () => {
      try {
        const [settingsResponse, heroImagesResponse, testimonialsResponse] = await Promise.all([
          api.get('/public/settings'),
          api.get('/public/hero-images'),
          api.get('/public/testimonials'),
        ]);

        if (cancelled) return;

        const nextData = {
          settings: { ...DEFAULT_SETTINGS, ...settingsResponse.data },
          heroImages: heroImagesResponse.data || [],
          testimonials: testimonialsResponse.data || [],
        };

        setSettings(nextData.settings);
        setHeroImages(nextData.heroImages);
        setTestimonials(nextData.testimonials);
        writeCachedPublicSiteData(nextData);
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading public site data', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPublicSiteData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PublicSiteContext.Provider value={{ settings, heroImages, testimonials, loading }}>
      {children}
    </PublicSiteContext.Provider>
  );
}

export function usePublicSite() {
  return useContext(PublicSiteContext);
}
