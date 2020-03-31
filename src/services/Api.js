import axios from "axios";

// const apiURL = "http://192.168.0.104:3333";
const apiURL = "https://api-tracking-adonis.herokuapp.com";

// comunicação com backend
const api = axios.create({
  baseURL: apiURL
});

export { apiURL };

export default api;
