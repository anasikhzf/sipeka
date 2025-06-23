import api from "../api/api";

export const createRating = async (rating) => {
    try {
        const response = await api.post("/ratings", rating, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};