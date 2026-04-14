import axios from 'axios';

// Get or create unique device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : 'dev-' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

// Extract device info from UserAgent
const getDeviceMetrics = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Browser';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Trident')) browser = 'Internet Explorer';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  let osName = 'Unknown';
  let osVersion = 'Unknown';
  if (ua.includes('Win')) {
    osName = 'Windows';
    const match = ua.match(/Windows NT (\d+\.\d+)/);
    if (match) osVersion = match[1];
  } else if (ua.includes('Mac')) {
    osName = 'MacOS';
    const match = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  } else if (ua.includes('Android')) {
    osName = 'Android';
    const match = ua.match(/Android (\d+(\.\d+)?(\.\d+)?)/);
    if (match) osVersion = match[1];
  } else if (ua.includes('Linux')) {
    osName = 'Linux';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    osName = 'iOS';
    const match = ua.match(/OS (\d+[._]\d+[._]?\d*)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  }

  let deviceType = 'desktop';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    deviceType = 'mobile';
  } else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'tablet';
  }

  const deviceName = `${browser} on ${osName}`;

  return { browser, osName, osVersion, deviceType, deviceName };
};

const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

agent.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const metrics = getDeviceMetrics();
    
    // Set headers based on session entity
    config.headers['x-device-id'] = getDeviceId();
    config.headers['x-device-name'] = metrics.deviceName;
    config.headers['x-device-type'] = metrics.deviceType;
    config.headers['x-browser'] = metrics.browser;
    config.headers['x-os-name'] = metrics.osName;
    config.headers['x-os-version'] = metrics.osVersion;
    config.headers['x-source'] = 'web';
    config.headers['x-client-source'] = 'web';
    
    // Set language query param with fallback to 'en'
    const lang = localStorage.getItem('i18nextLng') || 'en';
    config.params = {
      ...(config.params || {}),
      lang,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

agent.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loop if refresh token endpoint returns 401
      if (originalRequest.url === '/auth/refresh-token') {
        localStorage.removeItem('accessToken');
        // if (window.location.pathname !== '/signin') {
        //   window.location.href = '/signin';
        // }
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
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return agent(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear everything and redirect
        localStorage.removeItem('accessToken');
        // if (window.location.pathname !== '/signin') {
        //   window.location.href = '/signin';
        // }
        return Promise.reject(refreshError);
      }
    }

    // Handle other 401s or network errors
    if (error.response?.status === 401 || !error.response) {
      localStorage.removeItem('accessToken');
      // if (window.location.pathname !== '/signin') {
      //   window.location.href = '/signin';
      // }
    }

    return Promise.reject(error);
  }
);

export default agent;
