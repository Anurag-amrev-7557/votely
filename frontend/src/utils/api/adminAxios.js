import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || '';
const baseURL = apiUrl.endsWith('/api') ? apiUrl : (apiUrl ? `${apiUrl}/api` : '/api');

const adminAxios = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Admin-Context': 'true' // Mark requests as admin
    },
});

// Request interceptor to add ADMIN token
adminAxios.interceptors.request.use(
    (config) => {
        // Get token from localStorage - separate key for admin
        const token = localStorage.getItem('adminToken');

        if (token) {
            // Retrieve just the token part if it's the complex string we formerly used, 
            // OR if we switch to pure JWT, just use it. 
            // For now, let's assume we are storing the RAW JWT in adminToken.
            // If the legacy code stored "admin-token-timestamp", we need to handle that transition.
            // BUT my plan is to store the REAL JWT now.
            if (token.startsWith('admin-token-')) {
                // Legacy/Fake token - do not attach as Bearer for backend auth if backend expects JWT
                // But valid for client-side sessions.
                // However, for REAL backend admin actions, we need a Real JWT.
                // We will assume the NEW login logic stores a Real JWT.
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
adminAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Unauthorized admin request');
            // Optionally trigger admin logout here
        }
        return Promise.reject(error);
    }
);

export default adminAxios;
