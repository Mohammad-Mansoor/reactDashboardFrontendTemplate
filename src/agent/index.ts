import axios from 'axios';
import DeviceIntelligence from '../utils/device-intelligence';
// import { DeviceIntelligence } from '../utils/device-intelligence';

/**
 * CENTRALIZED AXIOS AGENT
 * 
 * Automatically attaches:
 * 1. Auth Bearer Token
 * 2. Advanced Device Intelligence (Fingerprint, Hardware, Guessed Model)
 * 3. i18n Language context
 */

const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

agent.interceptors.request.use(
  async (config) => {
    // 1. Auth Logic
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Intelligence Logic (Synchronous & Minimal)
    try {
      // Prioritize synchronous cached data for zero-latency
      let metrics = DeviceIntelligence.getCachedMetadata();
      
      // JIT Fallback (if app startup init hasn't completed yet)
      if (!metrics) {
        metrics = await DeviceIntelligence.init();
      }

      if (metrics) {
        // Essential Headers only (Reduced Size)
        config.headers['x-fingerprint'] = metrics.fingerprint;
        config.headers['x-device-name'] = metrics.deviceName;
        config.headers['x-device-type'] = metrics.deviceType;
        config.headers['x-os'] = metrics.os;
        config.headers['x-browser'] = metrics.browser;
        config.headers['x-client-id'] = 'advanced-saas-agent';
      }
    } catch (e) {
      console.warn('[Telemetry] Intelligence bridge failure:', e);
    }
    
    // 3. i18n Logic
    const lang = localStorage.getItem('i18nextLng') || 'en';
    config.params = {
      ...(config.params || {}),
      lang,
    };

    return config;
  },
  (error) => Promise.reject(error)
);

agent.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loop if refresh token endpoint returns 401
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        localStorage.removeItem('accessToken');
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (response.status === 200 || response.status === 201) {
          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Update header and retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return agent(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear everything and redirect
        localStorage.removeItem('accessToken');
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other 401s or network errors
    if (error.response?.status === 401 || !error.response) {
      localStorage.removeItem('accessToken');
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

export default agent;
