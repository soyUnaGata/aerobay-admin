import api from "@/services/api.js";

class AccessoryService {
    async getAllAccessories() {
        return await api.get('accessories')
            .then((response) => response.data.accessories)
            .catch((err) => null);
    }

    async addAccessory(accessory) {
        return await api.post(`accessories`, accessory)
    }

    async updateAccessory(id, accessory) {
        return await api.put(`accessories/${id}`, accessory);
    }

    async getAccessory(id) {
        return await api.get(`accessories/${id}`)
            .then((response) => response.data.accessory)
            .catch((err) => null);
    }

    async removeAccessory(id) {
        return await api.delete(`accessories/${id}`);
    }
}

export default new AccessoryService();