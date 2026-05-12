import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: "/api/v1/",
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ApiError extends Error {
  status: number;
  constructor(msg: string, status: number) {
    super(msg);
    this.status = status;
  }
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error.response?.data?.detail ?? error.message ?? "Error de red";
    const status = error.response?.status ?? 0;
    return Promise.reject(new ApiError(msg, status));
  }
);

export default api;
