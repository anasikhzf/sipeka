import api from "../api/api";

export const getResponses = async () => {
    try {
        const response = await api.get("/responses");
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
} 