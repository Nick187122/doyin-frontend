import { useEffect, useState } from 'react';
import api from '../services/api';

const CACHE_KEY = 'public_catalog_data';
const CACHE_TTL_MS = 5 * 60 * 1000;

export function getCachedPublicCatalog() {
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

function writeCatalogCache(data) {
  sessionStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  );
}

export function usePublicCatalog() {
  const cached = getCachedPublicCatalog();
  const [products, setProducts] = useState(cached?.products || []);
  const [categories, setCategories] = useState(cached?.categories || []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;

    const fetchCatalog = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get('/public/products'),
          api.get('/public/categories'),
        ]);

        if (cancelled) return;

        const nextData = {
          products: productsResponse.data || [],
          categories: categoriesResponse.data || [],
        };

        setProducts(nextData.products);
        setCategories(nextData.categories);
        writeCatalogCache(nextData);
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch catalog data', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, categories, loading };
}
