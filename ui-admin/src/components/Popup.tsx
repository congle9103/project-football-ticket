"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  autoClose?: boolean;
  duration?: number;
};

export default function Popup({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
  autoClose = true,
  duration = 3000,
}: PopupProps) {
  useEffect(() => {
    if (!autoClose || !isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const color =
    type === "success"
      ? "border-green-500"
      : type === "error"
      ? "border-red-500"
      : "border-blue-500";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div
        className={`bg-white w-[400px] rounded-lg shadow-lg border-l-4 ${color} p-6 relative animate-scaleIn`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose size={20} />
        </button>

        <div className="text-lg font-bold mb-2">{title}</div>
        <div className="text-gray-600">{message}</div>
      </div>

      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}