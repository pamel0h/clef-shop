import { useState, useEffect, useCallback, useRef } from 'react';
import i18n from '../i18n';
import { useCatalogDataContext } from '../../context/CatalogDataContext';

export default function useCatalogData(type, options = {}, skip = false) {
  const [data, setData] = useState(type === 'product_details' ? {} : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPollingPaused, setIsPollingPaused] = useState(false);
  const [isManualUpdate, setIsManualUpdate] = useState(false);

  const {
    lastUpdatedMap,
    translationsLastUpdatedMap,
    updateLastUpdated,
    updateTranslationsLastUpdated,
  } = useCatalogDataContext();

  const lastUpdated = lastUpdatedMap[type] || null;
  const translationsLastUpdated = translationsLastUpdatedMap[type] || null;
  const intervalRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
  };

  const fetchData = useCallback(async (silent = false) => {
    if (skip || isPollingPaused) {
      setData(type === 'product_details' ? {} : []);
      return;
    }

    try {
      if (!silent) setLoading(true);
      setError(null);

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
      if (!silent) setLoading(false);
    }
  }, [type, options.category, options.subcategory, options.id, options.query, skip, isPollingPaused]);

  // Отдельная функция для обновления переводов
  const reloadTranslations = useCallback(async () => {
    try {
      i18n.services.backendConnector.backend.cache?.clear?.();
    } catch (reloadError) {
    }
  }, []);

  // Поллинг с улучшенной логикой
  useEffect(() => {
    if (type === 'brands' || type === 'spec_keys_values') return;

    const startPolling = () => {
      intervalRef.current = setInterval(async () => {
        if (isPollingPaused || isManualUpdate) return;

        try {
          const response = await fetch('/api/catalog/last-updated');
          const pollingData = await response.json();

          let needsDataRefresh = false;
          let needsTranslationRefresh = false;

          if (pollingData.last_updated !== lastUpdated && lastUpdated !== null) {
            updateLastUpdated(type, pollingData.last_updated);
            needsDataRefresh = true;
          } else if (lastUpdated === null) {
            updateLastUpdated(type, pollingData.last_updated);
          }

          if (pollingData.translations_last_updated !== translationsLastUpdated && translationsLastUpdated !== null) {
            updateTranslationsLastUpdated(type, pollingData.translations_last_updated);
            needsTranslationRefresh = true;
          } else if (translationsLastUpdated === null) {
            updateTranslationsLastUpdated(type, pollingData.translations_last_updated);
          }

          // Обновляем переводы сначала, потом данные
          if (needsTranslationRefresh) {
            await reloadTranslations();
          }
          
          if (needsDataRefresh) {
            await fetchData(true); // silent = true для поллинга
          }
        } catch (error) {
          console.error('Polling error:', error.message);
        }
      }, 4000);
    };

    startPolling();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [lastUpdated, translationsLastUpdated, fetchData, type, isPollingPaused, isManualUpdate, reloadTranslations]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pausePolling = useCallback(() => setIsPollingPaused(true), []);
  const resumePolling = useCallback(() => setIsPollingPaused(false), []);

  // Улучшенная функция refetch с поддержкой обновлений
  const refetch = useCallback(async (updateTimestamps = false) => {
    setIsManualUpdate(true);
    
    try {
      if (updateTimestamps) {
        // Получаем актуальные timestamps
        const response = await fetch('/api/catalog/last-updated');
        const timestampData = await response.json();
        updateLastUpdated(type, timestampData.last_updated);
        updateTranslationsLastUpdated(type, timestampData.translations_last_updated);
        
        // Обновляем переводы
        await reloadTranslations();
      }
      
      // Обновляем данные
      await fetchData();
    } finally {
      setIsManualUpdate(false);
    }
  }, [fetchData, type, updateLastUpdated, updateTranslationsLastUpdated, reloadTranslations]);

  return {
    data,
    loading,
    error,
    refetch,
    pausePolling,
    resumePolling,
    reloadTranslations,
    updateLastUpdated: (value) => updateLastUpdated(type, value),
    updateTranslationsLastUpdated: (value) => updateTranslationsLastUpdated(type, value),
  };
}