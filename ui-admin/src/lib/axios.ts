"use client";

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:3000
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(null);
  });
  failedQueue = [];
};

// Request interceptor (nếu cần thêm Authorization header – nhưng bạn dùng cookie nên không bắt buộc)
api.interceptors.request.use(
  (config) => {
    // Nếu sau này bạn muốn gửi Bearer token thay vì cookie thì thêm ở đây
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – xử lý refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đang refresh → chờ và retry sau
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi refresh
        await api.post("/auth/refresh"); // backend sẽ set cookie accessToken mới

        // Refresh thành công → retry request gốc (cookie đã được browser tự update)
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh fail → logout hoặc redirect
        console.error("Refresh token failed", refreshError);
        // Ví dụ: window.location.href = "/login"; hoặc gọi hàm logout
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;