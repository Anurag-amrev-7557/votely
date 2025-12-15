import axios from 'axios';

// Create axios instance with default configuration
// Create axios instance with default configuration
const apiUrl = import.meta.env.VITE_API_URL || '';
// If VITE_API_URL is set, append /api, otherwise use relative /api for proxy
const baseURL = apiUrl ? `${apiUrl}/api` : '/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor to add auth headers if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      console.log('Unauthorized request, user may need to log in');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 