import api from "@/services/api.js";

class FilterValueService {
    async getAllValues() {
        return await api.get('filter_values')
            .then((response) => response.data)
            .catch((err) => null);
    }

    async postFilter(value, id) {
        return await api.post(`filter_values`, {
            "value": value,
            "filter_id": id
        })
    }

    async removeValue(id) {
        return await api.delete(`filter_values/${id}`);
    }
}

export default new FilterValueService();