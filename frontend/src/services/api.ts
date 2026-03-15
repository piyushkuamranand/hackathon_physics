import axios, { AxiosInstance, AxiosError } from "axios";
import { ENDPOINTS } from "./endpoints";
import { PredictionRequest, PredictionResponse, HealthResponse } from "../types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for responses to handle errors globally 
apiClient.interceptors.response.use(
  (response) => Math.floor(response.status / 100) === 2 ? response : Promise.reject(response),
  (error: AxiosError) => {
    let message = "An unknown error occurred.";
    if (error.response) {
      if (
        error.response.data &&
        typeof error.response.data === "object" &&
        "detail" in error.response.data
      ) {
        message = (error.response.data as { detail: string }).detail;
      } else {
        message = error.message;
      }
    } else if (error.request) {
      // The request was made but no response was received
      message = "No response received from the server. Check if backend is running.";
    } else {
      // Something happened in setting up the request that triggered an Error
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const apiService = {
  checkHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>(ENDPOINTS.HEALTH);
    return response.data;
  },

  optimizeCircuit: async (data: PredictionRequest): Promise<PredictionResponse> => {
    const response = await apiClient.post<PredictionResponse>(ENDPOINTS.PREDICT, data);
    return response.data;
  },
};
