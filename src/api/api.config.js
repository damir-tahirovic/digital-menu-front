import axios from 'axios';
import Cookies from 'js-cookie';
export const BASE_URL = "http://192.168.1.101:8000/api"

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('token');
            Cookies.remove('name');
            Cookies.remove('surname');
            Cookies.remove('username');
            Cookies.remove('email');
            Cookies.remove('role');

            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);