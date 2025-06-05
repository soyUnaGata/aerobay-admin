import api from "@/services/api.js";

class DroneService {
    async getAllDrones() {
        return await api.get('drones')
            .then((response) => response.data.drones)
            .catch((err) => null);
    }

    async addDrone(drone) {
        try {
            const response = await api.post(`drones`, drone);
            return {success: true, data: response.data.drones};
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.errors || {message: 'Something went wrong'}
            };
        }
    }

    async updateDrone(id, drone) {
        return await api.put(`drones/${id}`, drone);
    }

    async getDrone(id) {
        return await api.get(`drones/${id}`)
            .then((response) => response.data.drone)
            .catch((err) => null);
    }

    async removeDrone(id) {
        return await api.delete(`drones/${id}`);
    }
}

export default new DroneService();