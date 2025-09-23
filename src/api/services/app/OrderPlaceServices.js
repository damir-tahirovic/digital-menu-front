import { axiosInstance, BASE_URL } from "../../api.config";

export const orderPlaceList = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/order-place/list`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const orderPlaceCreate = async (data) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/order-place/create`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const orderPlaceUpdate = async (id, data) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/order-place/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const orderPlaceDelete = async (id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/order-place/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};