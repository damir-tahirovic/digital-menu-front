// src/api/services/app/OrderServices.js
import { axiosInstance, BASE_URL } from "../../api.config";

export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post(
            `${BASE_URL}/order/create`,
            orderData
        );
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);
        throw error;
    }
};

export const orderList = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/order/list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        throw error;
    }
};

export const myOrders = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/order/my-orders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        throw error;
    }
};

export const takeOrder = async (orderId) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/order/take-order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error taking order:', error.response?.data || error.message);
        throw error;
    }
};

