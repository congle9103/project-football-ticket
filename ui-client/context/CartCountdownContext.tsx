"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface CartCountdownContextType {
  timeLeft: number | null;
  startCountdown: () => void;
  stopCountdown: () => void;
}

const CartCountdownContext = createContext<CartCountdownContextType | null>(
  null,
);

export const CartCountdownProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isClearingRef = useRef(false); // tránh gọi API nhiều lần
  const queryClient = useQueryClient();
  const router = useRouter();

  // Clear cart API
  const clearCartMutation = useMutation({
    mutationFn: () => api.delete("/cart/clear"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Start countdown
  const startCountdown = () => {
    const expireTime = Date.now() + 30 * 60 * 1000; // 30 phút
    setTimeLeft(30 * 60);
    localStorage.setItem("cartExpireTime", expireTime.toString());
  };

  // Khi hết giờ
  const handleExpire = async () => {
    if (isClearingRef.current) return; // tránh gọi nhiều lần
    isClearingRef.current = true;

    try {
      await clearCartMutation.mutateAsync();

      localStorage.removeItem("cartExpireTime");
      setTimeLeft(null);

      router.push("/");
    } catch (error) {
      console.error("Expire error:", error);
    } finally {
      isClearingRef.current = false;
    }
  };

  // Load lại nếu có expireTime
  useEffect(() => {
    const savedExpire = localStorage.getItem("cartExpireTime");
    if (!savedExpire) return;

    const expireTime = parseInt(savedExpire);
    const remaining = Math.floor((expireTime - Date.now()) / 1000);

    if (remaining > 0) {
      setTimeLeft(remaining);
    } else {
      handleExpire();
    }
  }, []);

  // Countdown interval (chỉ tạo 1 interval duy nhất)
  useEffect(() => {
    if (timeLeft === null) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handleExpire();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft]);

  // Sync nhiều tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cartExpireTime") {
        if (!e.newValue) {
          setTimeLeft(null);
          return;
        }

        const expireTime = parseInt(e.newValue);
        const remaining = Math.floor((expireTime - Date.now()) / 1000);

        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          handleExpire();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const stopCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    localStorage.removeItem("cartExpireTime");
    setTimeLeft(null);
  };

  return (
    <CartCountdownContext.Provider value={{ timeLeft, startCountdown, stopCountdown }}>
      {children}
    </CartCountdownContext.Provider>
  );
};

export const useCartCountdown = () => {
  const context = useContext(CartCountdownContext);
  if (!context) {
    throw new Error("useCartCountdown must be used inside Provider");
  }
  return context;
};
