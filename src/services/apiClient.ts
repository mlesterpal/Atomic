import axios from "axios";

const API_BASE_URL = "https://localhost:7086/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});
