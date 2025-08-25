import axios, { AxiosInstance } from "axios";
import toast from "react-hot-toast";

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
// instance.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     // Handle response error (e.g., redirect to login on 401)
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       setTimeout(() => {
//         toast.error(
//           "Your session has expired. You will be redirected to the login page."
//         );
//       }, 3000);
//       window.location.href = "/auth/login";
//       localStorage.removeItem("accesstoken");
//     }
//     return Promise.reject(error);
//   }
// );

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accesstoken");

      // Show toast immediately
      toast.error("Your session has expired. Redirecting to login...", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#fee2e2",
          border: "1px solid #fecaca",
          color: "#dc2626",
        },
      });

      // Smooth redirect with delay
      setTimeout(() => {
        // Add a fade-out effect to the page before redirect
        document.body.style.opacity = "0.7";
        document.body.style.transition = "opacity 0.3s ease-out";

        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 300);
      }, 3000);
    }

    return Promise.reject(error);
  }
);
