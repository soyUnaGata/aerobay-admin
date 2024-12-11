import axios from "axios";

const instance = axios.create({
    baseURL: "https://aerobay.onrender.com/api/",
    headers: {'content-type': 'application/json'}
});

export default instance;