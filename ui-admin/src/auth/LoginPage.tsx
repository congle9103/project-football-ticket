import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore"; 
import { FaEye, FaEyeSlash } from "react-icons/fa6";

// ✅ Schema xác thực
const schema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

type LoginFormInputs = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Lấy hàm setUser từ Zustand store
  const setUser = useAuthStore((state) => state.setUser);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoginError(null);
      setLoading(true);

      // ✅ Gọi đúng API login
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/staff/login",
        data
      );

      const { token, user } = res.data.data;

      localStorage.setItem("token", token)
      // ✅ Lưu user vào Zustand và localStorage
      setUser({ ...user, token });

      // ✅ Điều hướng về dashboard
      window.location.href = "/dashboardPage";
    } catch (err: any) {
      console.error("❌ Lỗi khi đăng nhập:", err);
      setLoginError(
        err.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Đăng nhập hệ thống
        </h2>

        {loginError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              {...register("username")}
              placeholder="Nhập tên đăng nhập..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Nhập mật khẩu..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />

              {/* 👁 Nút hiện/ẩn mật khẩu */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FaEye className="w-5 h-5" />
                ) : (
                  <FaEyeSlash className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Đang kiểm tra..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} BookStore Admin
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
