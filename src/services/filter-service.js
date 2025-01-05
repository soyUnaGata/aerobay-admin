import api from "@/services/api.js";

class FilterService {
    async getAllFilters() {
        return await api.get('filter')
            .then((response) => response.data)
            .catch((err) => null);
    }

    async getFilter(id) {
        return await api.get(`filter/${id}`)
            .then(res => res.data)
            .catch((err) => null);
    }

    async postFilter(name, category, group) {
        return await api.post(`filter`, {
            "name": name,
            "category_id": category,
            "group_id": group
        });
    }

    async updateFilter(id, name, category, group) {
        return await api.put(`filter/${id}`, {
            "name": name,
            "category_id": category,
            "group_id": group
        });
    }

    async removeFilter(id) {
        return await api.delete(`filter/${id}`);
    }
}

export default new FilterService();