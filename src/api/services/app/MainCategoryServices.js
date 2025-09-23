import { axiosInstance, BASE_URL } from "../../api.config";

export const mainCategoryList = async () => {
    try {
        const response = await axiosInstance.get(
            `${BASE_URL}/main-category/list`,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const mainCategoryShow = async (id) => {
    try {
        const response = await axiosInstance.get(
            `${BASE_URL}/main-category/${id}`,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const mainCategoryCreate = async (data, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify({ name: data.name }));
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await axiosInstance.post(
            `${BASE_URL}/main-category/create`,
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


export const mainCategoryUpdate = async (id, data, imageFile) => {
    try {
        const formData = new FormData();
        const submitData = {
            name: data.name
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
            `${BASE_URL}/main-category/${id}`,
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
