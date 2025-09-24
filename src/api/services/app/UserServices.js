import { axiosInstance, BASE_URL } from "../../api.config";
import axios from 'axios';

export const userList = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/user/list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const userUpdate = async (id, data) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/user/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const updateMyProfile = async (data) => {
    try {
        const response = await axiosInstance.put('/update-my-profile', data);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};


export const changePassword = async (data) => {
    try {
        const response = await axiosInstance.put('/user/change-password', {
            current_password: data.current_password,
            new_password: data.new_password,
            new_password_confirmation: data.confirm_new_password,
        });
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

