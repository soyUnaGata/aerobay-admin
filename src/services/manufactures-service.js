import api from "@/services/api.js";

class ManufacturesService {
    async getAllManufactures() {
        return await api.get("manufactures")
            .then(res => res.data.data)
            .catch((err) => null);
    }

    async addManufacturer(manufacture) {
        return await api.post(`manufactures`, manufacture)
    }

    async updateManufacturer(id, category) {
        return await api.put(`manufactures/${id}`, category);
    }

    async getManufacturer(id) {
        return await api.get(`manufactures/${id}`)
            .then((response) => response.data.data)
            .catch((err) => null);
    }

    async removeManufacturer(id) {
        return await api.delete(`manufactures/${id}`);
    }
}

export default new ManufacturesService();