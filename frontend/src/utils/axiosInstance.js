// src/utils/axiosInstance.js
import axios from 'axios';

// const instance = axios.create({
//   baseURL:process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
// });

const instance = axios.create({
  baseURL:'http://localhost:5001/api',
});
// process.env.REACT_APP_API_URL || '

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
