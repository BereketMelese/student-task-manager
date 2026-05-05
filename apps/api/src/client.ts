import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const API_URL = process.env.API_URL || "http://localhost:3001";

export const client: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Future: Add auth tokens here
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(
        new Error(
          "No response from server. Please check your network connection.",
        ),
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error(error.message));
    }
  },
);
