import axios from "axios";


const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {
  const accesstoken = localStorage.getItem('accesstoken');

  if (accesstoken) {
    config.headers.Authorization = `Bearer ${accesstoken}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default axiosInstance;