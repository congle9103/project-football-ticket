"use client";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import Popup from "@/components/Popup";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        "http://localhost:3000/auth/login", // port backend
        { username, password },
        {
          withCredentials: true, // QUAN TRỌNG để nhận cookie
        },
      );

      return res.data;
    },
    onSuccess: (data) => {
      setShowPopup(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500); // đợi popup hiện 1.5s
      router.refresh(); // để server component đọc cookie mới
    },
    onError: (error: any) => {
      console.log(error);
      alert("Sai tên đăng nhập hoặc mật khẩu");
    },
  });

  return (
    <div className="-mx-30 -mb-8">
      <div
        className="min-h-screen
    bg-[url('/images/background.png')]
    bg-no-repeat
    bg-cover
    bg-center
    flex items-center justify-center"
      >
        <div className="relative z-10">
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-150 bg-white rounded-2xl shadow-xl p-8">
              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                Đăng nhập
              </h2>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loginMutation.mutate();
                }}
                className="space-y-4"
              >
                {/* Tên đăng nhập */}
                <div>
                  <label className="font-semibold text-gray-700 mb-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>

                {/* Mật khẩu */}
                <div>
                  <label className="font-semibold text-gray-700 mb-1">
                    Mật khẩu
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                      {showPassword ? <LuEyeClosed /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg
            font-semibold cursor-pointer hover:bg-blue-700 transition"
                >
                  {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-gray-500 mt-6">
                Bạn chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Đăng nhập thành công 🎉"
        message="Bạn đã đăng nhập thành công"
      />
    </div>
  );
};

export default Login;
