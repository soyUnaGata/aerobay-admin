import api from "@/services/api.js";

class CategoryService {
    async getAllCategories() {
        return await api.get('categories')
            .then((response) => response.data.data)
            .catch((err) => null);
    }

    async addCategory(category) {
        return await api.post(`categories`, category)
    }

    async updateCategory(id, category) {
        return await api.put(`categories/${id}`, category);
    }

    async getCategory(id) {
        return await api.get(`categories/${id}`)
            .then((response) => response.data.data)
            .catch((err) => null);
    }

    async removeCategory(id) {
        return await api.delete(`categories/${id}`);
    }
}

export default new CategoryService();