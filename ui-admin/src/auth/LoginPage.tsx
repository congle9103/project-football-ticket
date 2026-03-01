import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Popup from "../components/Popup";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:3000/auth/staff-login`,
        { username, password },
      );

      console.log("Login successful:", res.data);

      setShowPopup(true);

      setTimeout(() => {
        window.location.href = "/dashboardPage";
        setShowPopup(false);
      }, 1500);
    } catch (error: any) {
      console.log(error);
      alert("Sai tên đăng nhập hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-8 text-white">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide">Hệ thống quản lý</h1>
          <p className="text-sm text-white/80 mt-2">
            Đăng nhập để tiếp tục vào hệ thống
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm mb-2 text-white/90">
              Tên đăng nhập
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Nhập tên đăng nhập..."
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
              placeholder-white/60 text-white focus:outline-none 
              focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2 text-white/90">Mật khẩu</label>

            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                placeholder-white/60 text-white focus:outline-none 
                focus:ring-2 focus:ring-white focus:bg-white/30 transition-all pr-12"
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-white/70 hover:text-white transition"
              >
                {showPassword ? (
                  <FaEye className="w-5 h-5" />
                ) : (
                  <FaEyeSlash className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center text-sm text-white/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-white" />
              Ghi nhớ đăng nhập
            </label>
            <button type="button" className="hover:underline">
              Quên mật khẩu?
            </button>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            type="button"
            className="w-full py-3 rounded-xl bg-white text-indigo-600 font-semibold cursor-pointer
            hover:bg-indigo-100 active:scale-[0.98] transition-all shadow-lg"
          >
            Đăng nhập
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-white/70 mt-8">
          © {new Date().getFullYear()} Football Ticket Admin
        </p>
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

export default LoginPage;
