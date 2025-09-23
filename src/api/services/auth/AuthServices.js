import { axiosInstance, BASE_URL } from "../../api.config";

export const loginUser = async (credentials) => {
    try {
        const response = await axiosInstance.post(
            `${BASE_URL}/login`,
            {
                username: credentials.username,
                password: credentials.password
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (data) => {
    try {
        const response = await axiosInstance.post(
            `${BASE_URL}/register`,
            {
                name: data.name,
                surname: data.surname,
                username: data.username,
                email: data.email || null,
                password: data.password,
                confirm_password: data.confirm_password,
                role: data.role
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/logout`);
        return response.data;
    } catch (error) {
        throw error;
    }
};