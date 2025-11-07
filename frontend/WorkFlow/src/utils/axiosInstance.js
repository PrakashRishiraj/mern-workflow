import axios from 'axios';
import { BASE_URL } from './apiPaths';

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // Optional: set a timeout for requests

    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = '/login';
            } else if (error.response.status === 500) {
                console.error('Server error:', error.response.data);
            }
        }
        else if (error.code === 'ECONNABORTED') {   
            console.error('Request timeout:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;