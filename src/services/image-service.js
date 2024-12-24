import api from "@/services/api.js";

class ImageService {
    async getAllImages() {
        return await api.get('images')
            .then(response => response.data.data)
            .catch((err) => null);
    }

    async getImage(id) {
        return await api.get(`images/${id}`)
            .then(res => res.data.image)
    }

    async postImages(name, value) {
        return await api.put('images', {
            name: name,
            url: value,
        })
    }

    async updateImage(id, name, value) {
        return await api.put(`images/${id}`, {
            name: name,
            url: value,
        })
    }
}

export default new ImageService();