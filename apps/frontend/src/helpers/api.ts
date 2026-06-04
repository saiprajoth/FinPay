import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // CRITICAL: Tells Axios to automatically send cookies with every request
});

export default api;
