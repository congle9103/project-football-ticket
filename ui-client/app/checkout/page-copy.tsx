"use client";

import Image from "next/image";
import { useState } from "react";
import { FaRegCircle } from "react-icons/fa";
import { FaRegCircleDot } from "react-icons/fa6";
import { paymentMethods } from "@/utils/paymentMethods";

const Checkout = () => {
  const [selected, setSelected] = useState(
    "Thanh toán bằng tiền mặt khi nhận hàng",
  );

  // Hàm chọn phương thức thanh toán
  const handleSelectPayment = (methodName: string) => {
    // if (!session?.user) return;

    if (methodName !== selected) {
      // Cập nhật state
      setSelected(methodName);

      // Lưu vào localStorage
      // const key = `paymentMethods_${session.user.username}`;
      // localStorage.setItem(key, JSON.stringify(methodName));
    }
  };

  return (
    <div>
      {/* Thông tin người đặt hàng */}
      <div className="text-2xl font-bold mt-4">Thông tin người đặt hàng</div>
      <div className="grid gap-y-2 mt-2">
        <div>
          Email <span className="text-red-500">(*)</span>
        </div>
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#f68634]"
          type="text"
          placeholder="Email"
        />
        <div className="text-sm text-gray-500">
          Hãy đảm bảo nhập địa chỉ email hợp lệ. Chúng tôi sẽ gửi cho bạn xác
          nhận đơn hàng bao gồm liên kết mà bạn cần để truy cập đơn hàng sau.
        </div>
        <div>
          Số điện thoại <span className="text-red-500">(*)</span>
        </div>
        <input
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
      <div className="flex mt-2 w-full p-2 border border-gray-300 rounded-md">
        <div>1.</div>&nbsp;
        <div>Khán đài A</div>
      </div>

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
              {/* Radio button */}
              <div className="flex-shrink-0">
                {selected === method.name ? (
                  <FaRegCircleDot className="text-[#f68634] h-6 w-6" />
                ) : (
                  <FaRegCircle className="text-gray-300 h-6 w-6" />
                )}
              </div>

              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <Image
                  src={method.icon}
                  alt={method.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              {/* Tên phương thức */}
              <span className="text-base font-medium text-gray-800">
                {method.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button className="mt-8 bg-[#f68634] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e57a2a] transition cursor-pointer">
          Thanh toán ngay
        </button>
      </div>
    </div>
  );
};

export default Checkout;
