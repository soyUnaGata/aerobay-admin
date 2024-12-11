import api from "@/services/api.js";

class FilterService {
    async getAllFilters() {
        return await api.get('filter')
            .then((response) => response.data)
            .catch((err) => null);
    }
}

export default new FilterService();