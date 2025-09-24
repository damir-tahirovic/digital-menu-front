import { axiosInstance, BASE_URL } from "../../api.config";

export const itemShow = async (id) => {
    try {
        const response = await axiosInstance.get(
            `${BASE_URL}/item/${id}`,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const itemCreate = async (data, imageFile) => {
    try {
        const formData = new FormData();

        formData.append('data', JSON.stringify({
            name: data.name,
            category_id: data.category_id,
            description: data.description,
            item_types: data.item_types
        }));

        if (imageFile) {
            formData.append('image', imageFile);
        }

        console.log(formData);

        const response = await axiosInstance.post(
            `${BASE_URL}/item/create`,
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

export const itemUpdate = async (id, data, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify({
            name: data.name,
            category_id: data.category_id,
            description: data.description,
            item_types: data.item_types,
            remove_current_image: data.remove_current_image
        }));

        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (data.remove_current_image) {
            formData.append('remove_current_image', 'true');
        }
        formData.append('_method', 'PUT');

        const response = await axiosInstance.post(
            `${BASE_URL}/item/${id}`,
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