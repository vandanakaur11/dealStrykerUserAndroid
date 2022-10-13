import axios from "axios";

const api = axios.create({
    baseURL: "https://chassis-staging.herokuapp.com/api",
});

export default api;
