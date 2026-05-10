import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 15000,
  withCredentials: false, // usually not needed with localStorage auth
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Auto logout on unauthorized
    if (error.response?.status === 401) {
      console.log("Session expired");

      // Remove token
      localStorage.removeItem("access_token");

      // Optional redirect
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default api;
