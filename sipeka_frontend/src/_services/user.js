import api from "../api/api";

export const getUsers = async () => {
    try {
        const response = await api.get("/users");
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};