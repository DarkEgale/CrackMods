import { useState, useEffect } from 'react';

export const useApps = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApps = async (params = {}) => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/apps?${queryString}`);

      if (!response.ok) {
        throw new Error('Failed to fetch apps');
      }

      const data = await response.json();
      setApps(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchApps = async (query, category = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);

      const response = await fetch(`/api/apps/search?${params}`);

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setApps(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAppsByCategory = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/apps/category/${category}`);

      if (!response.ok) {
        throw new Error('Failed to fetch apps by category');
      }

      const data = await response.json();
      setApps(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return {
    apps,
    loading,
    error,
    fetchApps,
    searchApps,
    getAppsByCategory
  };
};

export const useApp = (id) => {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApp = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/apps/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch app');
      }

      const data = await response.json();
      setApp(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadApp = async () => {
    try {
      const response = await fetch(`/api/apps/${id}/download`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${app?.name || 'app'}.apk`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    if (id) {
      fetchApp();
    }
  }, [id]);

  return {
    app,
    loading,
    error,
    fetchApp,
    downloadApp
  };
};