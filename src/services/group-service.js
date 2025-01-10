import api from "@/services/api.js";

class GroupService {
    async getAllGroups() {
        return await api.get('groups')
            .then((response) => response.data.data)
            .catch((err) => null);
    }

    async addGroup(group) {
        return await api.post(`groups`, group)
    }

    async updateGroup(id, group) {
        return await api.put(`groups/${id}`, group);
    }

    async getGroup(id) {
        return await api.get(`groups/${id}`)
            .then((response) => response.data.data)
            .catch((err) => null);
    }

    async removeGroup(id) {
        return await api.delete(`groups/${id}`);
    }
}

export default new GroupService();