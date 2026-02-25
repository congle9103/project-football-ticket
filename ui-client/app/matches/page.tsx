"use client";
import MatchItem from "@/components/MatchItem";
import { useQuery } from "@tanstack/react-query";
import { IMatch } from "@/types/match.type";
import axios from "axios";
import api from "@/lib/axios";

const Matches = () => {
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
    <div className="my-4">
      <h1 className="text-2xl font-sans font-bold">Các trận đấu sắp tới</h1>

      {isLoading && <p>Đang tải...</p>}
      {error && <p>Lỗi khi tải dữ liệu</p>}

      {matches.map((match) => (
        <MatchItem key={match.id} match={match} />
      ))}
    </div>
  );
};

export default Matches;
