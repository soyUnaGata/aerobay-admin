import api from "@/services/api.js";

class ImageService {
    async getAllImages() {
        return await api.get('images')
            .then(response => response.data.data)
            .catch((err) => null);
    }

    async postImages(name, value) {
        return await api.put('images', {
            name: name,
            url: value,
        })
    }
}

export default new ImageService();