import axios from "axios";

// Base API URL
const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await api.post("/auth/register", { name, email, password, role });
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error("Registration API error:", error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  },
};

// Appointment services
export const appointmentService = {
  getAppointments: async () => {
    try {
      const response = await api.get("/appointments");
      return response.data;
    } catch (error) {
      console.error("Get appointments API error:", error);
      throw error;
    }
  },
  
  getAppointmentById: async (id: string) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get appointment ${id} API error:`, error);
      throw error;
    }
  },
  
  createAppointment: async (appointmentData: any) => {
    try {
      console.log("Creating appointment with data:", appointmentData);
      const response = await api.post("/appointments", appointmentData);
      return response.data;
    } catch (error) {
      console.error("Create appointment API error:", error);
      throw error;
    }
  },
  
  updateAppointment: async (id: string, appointmentData: any) => {
    try {
      console.log("Updating appointment with data:", appointmentData);
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      console.error(`Update appointment ${id} API error:`, error);
      throw error;
    }
  },
  
  cancelAppointment: async (id: string) => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Cancel appointment ${id} API error:`, error);
      throw error;
    }
  },
  
  updateAppointmentStatus: async (id: string, status: string) => {
    try {
      console.log(`Updating appointment ${id} status to ${status}`);
      const response = await api.put(`/appointments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Update appointment ${id} status API error:`, error);
      throw error;
    }
  },
};

// User services
export const userService = {
  getUserProfile: async () => {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      console.error("Get user profile API error:", error);
      throw error;
    }
  },
  
  getProfessionals: async () => {
    try {
      const response = await api.get("/users/professionals");
      return response.data;
    } catch (error) {
      console.error("Get professionals API error:", error);
      throw error;
    }
  },
};

export default api;
