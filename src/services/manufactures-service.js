import api from "@/services/api.js";

class ManufacturesService {
    async getAllManufactures() {
        return await api.get("manufactures")
            .then(res => res.data.data)
            .catch((err) => null);
    }
}

export default new ManufacturesService();