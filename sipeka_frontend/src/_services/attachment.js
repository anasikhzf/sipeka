import api from "../api/api";

export const getAttachment = async () => {
    try {
        const response = await api.get("/attachments");
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createAttachment = async (attachment) => {
    try {
        const response = await api.post("/attachments", attachment, {
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

export const deleteAttachment = async (attachment_id) => {
    try {
        await api.delete(`/attachments/${attachment_id}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const showAttachment = async (attachment_id) => {
    try {
        const response = await api.get(`/attachments/${attachment_id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Base URL untuk image/file access
export const imageSTORAGE = "http://127.0.0.1:8000";