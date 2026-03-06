import axios from 'axios';

// Use production API URL from environment variable, or fallback to the Vite proxy route
const baseURL = import.meta.env.VITE_API_URL || `/api`;
console.log('API BaseURL initialized as:', baseURL);

const api = axios.create({
    baseURL: baseURL,
});

export default api;
