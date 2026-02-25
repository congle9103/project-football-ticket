"use client";

import MatchItem from "@/components/MatchItem";
import api from "@/lib/axios";
import { IMatch } from "@/types/match.type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";

export default function Home() {
  const {
    data: matches = [],
    isLoading,
    error,
  } = useQuery<IMatch[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await api.get("/matches");
      return res.data;
    },
  });

  return (
    <div>
      {/* Banner */}
      <div className="-mx-30">
        <Image
          src="/images/banner-shb-da-nang.png"
          alt="Banner Image"
          width={1920}
          height={600}
          className="w-full h-auto"
        />
      </div>

      {/* Next matches */}
      <div className="my-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-sans font-bold">Các trận đấu sắp tới</h1>
          <Link href="/matches" className="flex items-center">
            Xem thêm <MdArrowRightAlt className="ml-1" />
          </Link>
        </div>

        {isLoading && <p>Đang tải...</p>}
        {error && <p>Lỗi khi tải dữ liệu</p>}

        {matches.slice(0, 1).map((match) => (
          <MatchItem key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
