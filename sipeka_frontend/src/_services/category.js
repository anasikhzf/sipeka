import api from "../api/api";

export const getCategories = async () => {
    try {
        const response = await api.get("/categories");
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const createCategory = async (category) => {
    try {
        const response = await api.post("/categories", category);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const deleteCategory = async (category_id) =>{
    try {
        await api.delete(`/categories/${category_id}`)
    } catch (error) {
            console.log(error);
        throw error
    }
}
export const updateCategory = async (category_id, category) => {
    try {
        const response = await api.put(`/categories/${category_id}`, category);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const showCategory = async (category_id) => {
    try {
        const response = await api.get(`/categories/${category_id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}