"use client";

import { FaCartArrowDown } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Popup from "@/components/Popup";
import { useState } from "react";

type Props = {
  match_id: string;
  user_id: string;
  area: string;
  price: number;
};

export default function AddToCartButton({
  match_id,
  user_id,
  area,
  price,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPopup, setShowPopup] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/cart/add", {
        match_id,
        user_id,
        area,
        price,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setShowPopup(true);

      setTimeout(() => {
        router.push("/cart");
      }, 1500); // đợi popup hiện 1.5s
    },
  });

  const handleAdd = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    mutation.mutate();
  };

  return (
    <>
      <FaCartArrowDown
        onClick={handleAdd}
        className="text-white bg-[#f68634] border border-[#f68634] w-8 h-8 rounded-sm cursor-pointer hover:bg-[#e36b0f] transition-colors duration-300"
      />

      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Thành công 🎉"
        message="Vé đã được thêm vào giỏ hàng"
      />
    </>
  );
}
