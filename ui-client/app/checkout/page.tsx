"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegCircle } from "react-icons/fa";
import { FaRegCircleDot } from "react-icons/fa6";
import { paymentMethods } from "@/utils/paymentMethods";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useCartCountdown } from "@/context/CartCountdownContext";
import Popup from "@/components/Popup";

const Checkout = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(
    "Thanh toán bằng tiền mặt khi nhận hàng",
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { timeLeft, stopCountdown } = useCartCountdown();
  const [showPopup, setShowPopup] = useState(false);

  // Lấy thông tin user
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });
 
  // Lấy email, phone từ user nếu có
  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Lấy dữ liệu cart
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data;
    },
  });

  // Mutation thanh toán
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        cart.map((item: any) =>
          api.post("/tickets", {
            cartId: item.id,
            paymentMethod: selected,
          }),
        ),
      );
    },
    onSuccess: () => {
      stopCountdown();
      localStorage.removeItem("cartExpireTime");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        router.push("/");
      }, 2000);
    },
  });

  const handleSelectPayment = (methodName: string) => {
    if (methodName !== selected) {
      setSelected(methodName);
    }
  };

  const handleCheckout = () => {
    if (!cart.length) return;
    checkoutMutation.mutate();
  };

  // Tính tổng tiền
  const totalPrice = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div>
      {/* Thông tin người đặt hàng */}
      <div className="text-2xl font-bold mt-4">Thông tin người đặt hàng</div>
      <div className="grid gap-y-2 mt-2">
        <div>
          Email <span className="text-red-500">(*)</span>
        </div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#f68634]"
          type="text"
          placeholder="Email"
        />

        <div className="text-sm text-gray-500">
          Hãy đảm bảo nhập địa chỉ email hợp lệ. Chúng tôi sẽ gửi xác nhận đơn
          hàng qua email.
        </div>

        <div>
          Số điện thoại <span className="text-red-500">(*)</span>
        </div>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#f68634]"
          type="text"
          placeholder="Số điện thoại"
        />

        <div>Họ và tên</div>
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#f68634]"
          type="text"
          placeholder="Họ và tên"
        />
      </div>

      {/* Các vé đã đặt */}
      <div className="mt-4 text-2xl font-bold">Các vé đã đặt</div>

      {cart.length === 0 && (
        <div className="mt-4 text-gray-500">Giỏ hàng trống</div>
      )}

      {cart.map((item: any) => (
        <div key={item.id} className="flex justify-between gap-x-4">
          <div className="flex mt-2 w-full p-2 border border-gray-300 rounded-md">
            <div>{item.area}</div>
          </div>
          <div className="flex mt-2 w-full p-2 border border-gray-300 rounded-md">
            <div>Số lượng:</div>&nbsp;
            <div>{item.quantity}</div>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="mt-4 text-right font-bold text-lg">
          Tổng tiền: {totalPrice.toLocaleString()} đ
        </div>
      )}

      {/* Phương thức thanh toán */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Phương thức thanh toán</h3>

        <div className="flex flex-col gap-4">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              onClick={() => handleSelectPayment(method.name)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                ${
                  selected === method.name
                    ? "bg-red-50 border-2 border-[#f68634]"
                    : "border border-gray-200 hover:border-red-300 hover:bg-gray-50"
                }
              `}
            >
              <div className="flex-shrink-0">
                {selected === method.name ? (
                  <FaRegCircleDot className="text-[#f68634] h-6 w-6" />
                ) : (
                  <FaRegCircle className="text-gray-300 h-6 w-6" />
                )}
              </div>

              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <Image
                  src={method.icon}
                  alt={method.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              <span className="text-base font-medium text-gray-800">
                {method.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCheckout}
          disabled={!cart.length || checkoutMutation.isPending}
          className="mt-8 bg-[#f68634] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e57a2a] transition cursor-pointer disabled:opacity-50"
        >
          {checkoutMutation.isPending ? "Đang xử lý..." : "Thanh toán ngay"}
        </button>
      </div>
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Thanh toán thành công 🎉"
        message="Bạn đã thanh toán thành công"
      />
    </div>
  );
};

export default Checkout;
