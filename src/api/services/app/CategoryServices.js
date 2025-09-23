import { axiosInstance, BASE_URL } from "../../api.config";

export const categoryShow = async (id) => {
    try {
        const response = await axiosInstance.get(
            `${BASE_URL}/category/${id}`,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const categoryList = async () => {
    try {
        const response = await axiosInstance.get(
            `${BASE_URL}/category/list`,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const categoryCreate = async (data, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify({ name: data.name, main_category_id: data.main_category_id }));
        if (imageFile) {
            formData.append('image', imageFile);
        }
        console.log(formData);

        const response = await axiosInstance.post(
            `${BASE_URL}/category/create`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const categoryUpdate = async (id, data, imageFile) => {
    try {
        const formData = new FormData();
        const submitData = {
            name: data.name,
            main_category_id: data.main_category_id
        };

        if (data.remove_current_image) {
            submitData.remove_current_image = true;
        }

        formData.append('data', JSON.stringify(submitData));
        formData.append('_method', 'PUT'); // Laravel method override

        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await axiosInstance.post(
            `${BASE_URL}/category/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};