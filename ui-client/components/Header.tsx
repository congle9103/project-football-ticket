"use client";

import Image from "next/image";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCartCountdown } from "@/context/CartCountdownContext";

const Header = () => {
  //const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { timeLeft, startCountdown } = useCartCountdown();
  const prevCartLength = useRef(0);

  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data;
    },
    enabled: !!user, // chỉ gọi khi đã login
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      console.log("Logout successful");
      window.location.href = "/";
      router.refresh(); // để server component đọc cookie mới (đã bị xóa)
      router.replace("/"); // Redirect về trang chủ sau khi logout
    },
  });

  // Bắt đầu đếm ngược khi có item trong giỏ
  useEffect(() => {
    const currentLength = cart?.length || 0;
    const savedExpire = localStorage.getItem("cartExpireTime");

    // ✅ Chỉ start nếu:
    // - trước đó cart = 0
    // - bây giờ > 0
    // - và CHƯA có expireTime
    if (prevCartLength.current === 0 && currentLength > 0 && !savedExpire) {
      startCountdown();
    }

    prevCartLength.current = currentLength;
  }, [cart, startCountdown]);

  // Hàm format thời gian từ giây sang mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Tính tổng số lượng trong giỏ hàng
  const totalQuantity =
    cart?.reduce(
      (sum: number, item: any) => sum + Number(item.quantity || 1),
      0,
    ) || 0;

  return (
    <header>
      <div className="bg-[#f68634] flex justify-between px-32 py-2 text-white">
        <div className="flex items-center gap-x-4">
          <Link href="/">
            <Image
              className="cursor-pointer"
              src="/images/logo-shb-da-nang.png"
              alt="Logo SHB Đà Nẵng"
              width={50}
              height={50}
              priority
            />
          </Link>
          <Link href="/" className="cursor-pointer">
            Trang chủ
          </Link>
          <Link href="/matches" className="cursor-pointer">
            Lịch thi đấu
          </Link>
          <div className="cursor-pointer">Về chúng tôi</div>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="relative group">
            <div className="flex items-center gap-x-1 cursor-pointer">
              <FaRegUser />
              <span>{user ? user.username : "Tài khoản"}</span>
            </div>

            {/* Dropdown */}
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md
                   opacity-0 invisible group-hover:opacity-100
                   group-hover:visible transition-all duration-200 z-50"
            >
              {/* Arrow */}
              <div
                className="absolute -top-2 right-4 w-0 h-0 
                border-l-8 border-l-transparent
                border-r-8 border-r-transparent
                border-b-8 border-b-white"
              ></div>

              {!user ? (
                <div className="flex flex-col">
                  <Link
                    href="/login"
                    className="px-4 py-2 hover:bg-gray-100 text-black rounded-t-md"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 hover:bg-gray-100 text-black rounded-b-md"
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col">
                  <Link
                    href="/profile"
                    className="px-4 py-2 hover:bg-gray-100 text-black rounded-t-md"
                  >
                    Hồ sơ của tôi
                  </Link>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    className="px-4 py-2 hover:bg-gray-100 text-black rounded-b-md text-left cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
          <Link
            href="/cart"
            className="flex flex-col items-center gap-x-1 cursor-pointer relative"
          >
            <div className="flex items-center gap-x-1 relative">
              <IoCartOutline className="size-5" />
              Giỏ hàng
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-white text-[#f68634] text-xs px-2 rounded-full">
                  {totalQuantity}
                </span>
              )}
            </div>

            {timeLeft !== null && (
              <span className="absolute -bottom-3 bg-white text-[#f68634] text-xs px-2 rounded">
                {formatTime(timeLeft)}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
