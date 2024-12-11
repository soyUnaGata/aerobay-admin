import api from "@/services/api.js";

class FilterService {
    async getAllFilters() {
        return await api.get('filter')
            .then((response) => response.data)
            .catch((err) => null);
    }

    async removeFilter(id) {
        return await api.delete(`filter/${id}`);
    }
}

export default new FilterService();