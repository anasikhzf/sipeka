import api from "../api/api";

export const getComplaint = async () => {
    try {
        const response = await api.get("/complaints");
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
