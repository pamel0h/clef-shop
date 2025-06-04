
import { useState, useEffect, useCallback } from 'react';
import i18n from '../i18n';
import { useCatalogDataContext } from '../../context/CatalogDataContext';

export default function useCatalogData(type, options = {}, skip = false) {
  const [data, setData] = useState(type === 'product_details' ? {} : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPollingPaused, setIsPollingPaused] = useState(false);

  const {
    lastUpdatedMap,
    translationsLastUpdatedMap,
    updateLastUpdated,
    updateTranslationsLastUpdated,
  } = useCatalogDataContext();

  const lastUpdated = lastUpdatedMap[type] || null;
  const translationsLastUpdated = translationsLastUpdatedMap[type] || null;

  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
  };

  const fetchData = useCallback(async () => {
    if (skip || isPollingPaused) {
      setData(type === 'product_details' ? {} : []);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setData(type === 'product_details' ? {} : []);

      let url;
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };

      const isAdminRequest = type === 'admin_catalog' || type === 'brands' || type === 'spec_keys_values';
      if (isAdminRequest) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          throw new Error('Authorization token is missing');
        }
      }

      if (type === 'search') {
        url = `/api/search?query=${encodeURIComponent(options.query || '')}`;
      } else if (type === 'product_details' && options.id) {
        url = `/api/search?id=${encodeURIComponent(options.id)}&query=${encodeURIComponent(options.query || '')}`;
      } else if (type === 'products') {
        const params = new URLSearchParams({ type });
        if (options.category) params.append('category', options.category);
        if (options.subcategory) params.append('subcategory', options.subcategory);
        url = `/api/catalog/data?${params}`;
      } else if (type === 'admin_catalog') {
        url = `/api/admin/catalog/data`;
      } else if (type === 'brands') {
        url = `/api/admin/catalog/brands`;
      } else if (type === 'spec_keys_values') {
        url = `/api/admin/catalog/spec-keys-values`;
      } else if (type === 'categories') {
        url = `/api/catalog/data?type=categories`;
      } else if (type === 'subcategories') {
        const params = new URLSearchParams({ type: 'subcategories' });
        if (options.category) params.append('category', options.category);
        url = `/api/catalog/data?${params}`;
      } else {
        const params = new URLSearchParams({ type });
        if (options.category) params.append('category', options.category);
        if (options.subcategory) params.append('subcategory', options.subcategory);
        if (options.id) params.append('id', options.id);
        url = `/api/catalog/data?${params}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Access denied');
        } else {
          throw new Error(`HTTP error ${response.status}`);
        }
      }

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('useCatalogData: Non-JSON response:', textResponse);
        throw new Error('Expected JSON response, received invalid format');
      }

      const result = await response.json();

      if (!result?.success) {
        throw new Error(result.error || 'Server error');
      }

      setData(result.data || (type === 'product_details' ? {} : []));
    } catch (err) {
      console.error('useCatalogData: Fetch error:', err.message);
      setError(err.message);
      setData(type === 'product_details' ? {} : []);
    } finally {
      setLoading(false);
    }
  }, [type, options.category, options.subcategory, options.id, options.query, skip, isPollingPaused]);

  useEffect(() => {
    if (type === 'brands' || type === 'spec_keys_values') return;

    const interval = setInterval(async () => {
      if (isPollingPaused) return;

      try {
        const response = await fetch('/api/catalog/last-updated');
        const data = await response.json();

        if (data.last_updated !== lastUpdated && lastUpdated !== null) {
          updateLastUpdated(type, data.last_updated);
          await fetchData();
        } else if (lastUpdated === null) {
          updateLastUpdated(type, data.last_updated);
        }

        if (data.translations_last_updated !== translationsLastUpdated && translationsLastUpdated !== null) {
          console.log('Translations updated, reloading resources for language:', i18n.language);
          updateTranslationsLastUpdated(type, data.translations_last_updated);
          try {
            i18n.services.backendConnector.backend.cache?.clear?.();
            await i18n.reloadResources(i18n.language, 'translation');
            console.log('Translations reloaded successfully');
            await fetchData();
          } catch (reloadError) {
            console.error('Failed to reload translations:', reloadError);
          }
        } else if (translationsLastUpdated === null) {
          updateTranslationsLastUpdated(type, data.translations_last_updated);
        }
      } catch (error) {
        console.error('Polling error:', error.message);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [lastUpdated, translationsLastUpdated, fetchData, type, isPollingPaused]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pausePolling = useCallback(() => setIsPollingPaused(true), []);
  const resumePolling = useCallback(() => setIsPollingPaused(false), []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    pausePolling,
    resumePolling,
    updateLastUpdated: (value) => updateLastUpdated(type, value),
    updateTranslationsLastUpdated: (value) => updateTranslationsLastUpdated(type, value),
  };
}
