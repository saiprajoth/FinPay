import axios from "axios";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  withCredentials: true,
});

export default api;