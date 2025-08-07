import axios, { AxiosInstance } from "axios";

export const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("accesstoken");
        if (token) {
          // Set authorization header with "Bearer" prefix to match backend
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);
// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle response error (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);
