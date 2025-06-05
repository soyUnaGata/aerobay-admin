import api from "@/services/api.js";

class FilterValueService {
    async getAllValues() {
        return await api.get('filter_values')
            .then((response) => response.data)
            .catch((err) => null);
    }

    async updateFilter(id, value, filterId) {
        return await api.put(`filter_values/${id}`, {
            "value": value,
            "filter_id": filterId
        })
    }

    async postFilter(value, filterId) {
        return await api.post(`filter_values`, {
            "value": value,
            "filter_id": filterId
        })
    }

    async removeFilter(id) {
        return await api.delete(`filter_values/${id}`);
    }
}

export default new FilterValueService();