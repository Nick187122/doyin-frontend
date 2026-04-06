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
};

const PublicSiteContext = createContext({
  settings: DEFAULT_SETTINGS,
  heroImages: [],
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
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    let cancelled = false;

    const fetchPublicSiteData = async () => {
      try {
        const [settingsResponse, heroImagesResponse] = await Promise.all([
          api.get('/public/settings'),
          api.get('/public/hero-images'),
        ]);

        if (cancelled) return;

        const nextData = {
          settings: { ...DEFAULT_SETTINGS, ...settingsResponse.data },
          heroImages: heroImagesResponse.data || [],
        };

        setSettings(nextData.settings);
        setHeroImages(nextData.heroImages);
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
    <PublicSiteContext.Provider value={{ settings, heroImages, loading }}>
      {children}
    </PublicSiteContext.Provider>
  );
}

export function usePublicSite() {
  return useContext(PublicSiteContext);
}
