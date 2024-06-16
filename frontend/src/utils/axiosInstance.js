import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://ec2-3-27-172-114.ap-southeast-2.compute.amazonaws.com/api',
});

// Add a request interceptor to attach the token to every request
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
