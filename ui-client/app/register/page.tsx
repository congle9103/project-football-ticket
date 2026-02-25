"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";

const Register = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await axios.post("http://localhost:3000/users", data);
      return res.data;
    },
    onSuccess: () => {
      alert("Đăng ký thành công!");
      router.push("/login");
    },
    onError: () => {
      alert("Đăng ký thất bại!");
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    registerMutation.mutate({ username, password });
  };

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
                Đăng ký
              </h2>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
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

                {/* Nhập lại mật khẩu */}
                <div>
                  <label className="font-semibold text-gray-700 mb-1">
                    Nhập lại mật khẩu
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10
      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />

                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                      {showConfirmPassword ? <LuEyeClosed /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg
            font-semibold cursor-pointer hover:bg-blue-700 transition"
                >
                  {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-gray-500 mt-6">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
