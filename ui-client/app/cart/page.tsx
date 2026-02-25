"use client";

import Image from "next/image";
import Link from "next/link";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import { useCartCountdown } from "@/context/CartCountdownContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useEffect } from "react";

const Cart = () => {
  const queryClient = useQueryClient();
  const { timeLeft, stopCountdown } = useCartCountdown();

  // =========================
  // FETCH CART
  // =========================
  const { data: carts = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data;
    },
  });

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: any) =>
      api.patch(`/cart/${id}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // =========================
  // DELETE ONE
  // =========================
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/cart/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // =========================
  // DELETE ALL
  // =========================
  const clearMutation = useMutation({
    mutationFn: () => api.delete("/cart/clear"),
    onSuccess: () => {
      stopCountdown();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // =========================
  // FORMAT TIME
  // =========================
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // =========================
  // TOTAL PRICE
  // =========================
  const totalPrice = carts.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price) * Number(item.quantity || 1),
    0,
  );

  useEffect(() => {
    if (carts.length === 0) {
      stopCountdown();
    }
  }, [carts]);

  if (isLoading) {
    return <div className="p-10 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <div className="py-8 border-b border-gray-300 -mx-30">
        <div className="flex justify-between mx-30">
          <div className="font-bold text-xl">Giỏ hàng</div>
          {timeLeft !== null && (
            <div className="text-red-500 font-bold">{formatTime(timeLeft)}</div>
          )}
        </div>
      </div>

      {/* XÓA TẤT CẢ */}
      <div className="mt-8 flex justify-end cursor-pointer">
        <div
          onClick={() => clearMutation.mutate()}
          className="group flex items-center gap-x-1 border border-gray-500 rounded-md py-2 px-4 hover:bg-gray-800 text-white transition-colors duration-300"
        >
          <FaRegTrashCan className="text-gray-500 group-hover:text-white transition-colors duration-300" />
          <span className="text-gray-500 text-sm group-hover:text-white transition-colors duration-300">
            Xóa tất cả
          </span>
        </div>
      </div>

      {/* DANH SÁCH VÉ */}
      {carts.map((item: any) => (
        <div key={item.id} className="flex mt-8 pb-8 border-b border-gray-300">
          <Image
            src="/images/logo-shb-da-nang-ticket.png"
            alt="Logo SHB Đà Nẵng Ticket"
            width={80}
            height={80}
            className="mr-4"
          />
          <div className="grid gap-y-1">
            <div>{item.area}</div>
            <div className="text-gray-500 text-md font-semibold">
              {Number(item.price).toLocaleString()} VNĐ
            </div>

            <div className="flex gap-x-1">
              <div
                onClick={() =>
                  item.quantity > 1 &&
                  updateMutation.mutate({
                    id: item.id,
                    quantity: item.quantity - 1,
                  })
                }
                className="px-2 bg-[#f68634] text-white rounded-sm cursor-pointer"
              >
                -
              </div>

              <div>{item.quantity || 1}</div>

              <div
                onClick={() =>
                  updateMutation.mutate({
                    id: item.id,
                    quantity: (item.quantity || 1) + 1,
                  })
                }
                className="px-2 bg-[#f68634] text-white rounded-sm cursor-pointer"
              >
                +
              </div>
            </div>
          </div>

          <div
            onClick={() => deleteMutation.mutate(item.id)}
            className="group flex mb-auto ml-auto px-2 py-2 border border-gray-500 rounded-md cursor-pointer hover:bg-gray-800 text-white transition-colors duration-300"
          >
            <FaRegTrashCan className="text-gray-500 group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      ))}

      {/* TỔNG TIỀN */}
      <div className="mt-8 pt-8 border-t border-gray-300 -mx-30">
        <div className="mx-30">
          <div className="flex justify-end">
            Tổng tiền: {totalPrice.toLocaleString()} VNĐ
          </div>

          <div
            className="flex items-center mt-2 py-2 px-4 bg-gray-100 rounded-lg border border-gray-300
                focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition"
          >
            <MdDiscount className="mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Nhập mã khuyến mãi"
              className="bg-transparent outline-none flex-1"
            />
            <div className="ml-auto cursor-pointer">Áp dụng</div>
          </div>

          <div className="flex mt-4">
            <Link
              href="/checkout"
              className="ml-auto bg-[#f68634] text-white px-4 py-2 rounded-md hover:bg-[#e07a2d] transition-colors duration-300"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
