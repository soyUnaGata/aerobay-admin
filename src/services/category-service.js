import api from "@/services/api.js";

class CategoryService {
    async getAllCategories() {
        return await api.get('categories')
            .then((response) => response.data.data)
            .catch((err) => null);
    }

    async addGroup(group) {
        return await api.post(`categories`, group)
    }

    async updateGroup(id, group) {
        return await api.put(`categories/${id}`, group);
    }

    async getGroup(id) {
        return await api.get(`categories/${id}`)
            .then((response) => response.data.data)
            .catch((err) => null);
    }

    async removeGroup(id) {
        return await api.delete(`categories/${id}`);
    }
}

export default new CategoryService();