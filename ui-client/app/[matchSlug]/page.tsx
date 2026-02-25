"use client";

import AddToCartButton from "@/components/AddToCartButton";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { FaCartArrowDown } from "react-icons/fa";
import { IoCalendarOutline, IoInformation } from "react-icons/io5";

async function getMatch(matchSlug: string) {
  const decodedSlug = decodeURIComponent(matchSlug);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/matches/${decodedSlug}`,
    {
      cache: "no-store",
    },
  );

  return res.json();
}

const Match = () => {
  const { matchSlug } = useParams();

  const {
    data: match,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["match", matchSlug],
    queryFn: () => getMatch(matchSlug as string),
    enabled: !!matchSlug,
  });

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then((res) => res.data),
  });

  const [datePart, timePart] = match?.time?.split("--") || [];

  const formattedDate = datePart
    ? new Date(datePart).toLocaleDateString("vi-VN")
    : "";

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Có lỗi xảy ra</div>;
  if (!match) return null;

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

      {/* Thông tin trận đấu */}
      <div className="grid px-8 py-4 gap-y-4 border-2 border-gray-100 mt-8">
        <div className="flex justify-center text-4xl font-bold">
          SHB Đà Nẵng - {match.away_team}
        </div>

        <div className="flex justify-evenly">
          <div className="flex items-center">
            <CiLocationOn className="mr-1" />
            SVĐ Hòa Xuân
          </div>

          <div className="flex items-center">
            <IoCalendarOutline className="mr-1" />
            {match.round}
          </div>

          <div className="flex items-center">
            <CiCalendar className="mr-1" />
            {formattedDate}
          </div>

          <div className="flex items-center">
            <CiClock1 className="mr-1" />
            {timePart}
          </div>
        </div>
      </div>

      {/* Booking */}
      <div className="flex">
        {/* Sơ đồ sân vận động */}
        <div className="w-[65%] mr-8">
          <div className="flex justify-center my-6 text-3xl font-bold">
            Sân vận động Hòa Xuân Đà Nẵng
          </div>
          <Image
            src="/images/so-do-svd.webp"
            alt="Seat map"
            width={1300}
            height={900}
          />
        </div>
        <div className="w-[35%]">
          <div className="flex justify-center my-6 text-3xl font-bold">
            Danh sách vé
          </div>
          <div className="flex p-4 border-l-6 border-l-green-600 border-t-2 border-t-gray-100">
            <Image
              src="/images/logo-shb-da-nang-ticket.png"
              alt="Logo SHB Đà Nẵng Ticket"
              width={80}
              height={80}
              className="mr-4"
            />
            <div>
              <div className="text-sm font-semibold">Khán đài A</div>
              <div className="text-sm">
                100.000 VNĐ{" "}
                <span className="text-gray-500">( Gồm 8% VAT )</span>
              </div>
            </div>
            <div className="grid gap-y-2 ml-auto">
              <div>
                <IoInformation className="text-[#f68634] border border-[#f68634] w-8 h-8 rounded-sm cursor-pointer hover:bg-[#f68634] hover:text-white transition-colors duration-300" />
              </div>

              <AddToCartButton
                match_id={match.id}
                user_id={user?.id}
                area="A"
                price={100000}
              />
            </div>
          </div>

          <div className="flex p-4 border-l-6 border-l-green-600 border-t-2 border-t-gray-100">
            <Image
              src="/images/logo-shb-da-nang-ticket.png"
              alt="Logo SHB Đà Nẵng Ticket"
              width={80}
              height={80}
              className="mr-4"
            />
            <div>
              <div className="text-sm font-semibold">Khán đài B</div>
              <div className="text-sm">
                100.000 VNĐ{" "}
                <span className="text-gray-500">( Gồm 8% VAT )</span>
              </div>
            </div>
            <div className="grid gap-y-2 ml-auto">
              <div>
                <IoInformation className="text-[#f68634] border border-[#f68634] w-8 h-8 rounded-sm cursor-pointer hover:bg-[#f68634] hover:text-white transition-colors duration-300" />
              </div>

              <AddToCartButton
                match_id={match.id}
                user_id={user?.id}
                area="B"
                price={100000}
              />
            </div>
          </div>

          <div className="flex p-4 border-l-6 border-l-green-600 border-t-2 border-t-gray-100">
            <Image
              src="/images/logo-shb-da-nang-ticket.png"
              alt="Logo SHB Đà Nẵng Ticket"
              width={80}
              height={80}
              className="mr-4"
            />
            <div>
              <div className="text-sm font-semibold">Khán đài C</div>
              <div className="text-sm">
                50.000 VNĐ <span className="text-gray-500">( Gồm 8% VAT )</span>
              </div>
            </div>
            <div className="grid gap-y-2 ml-auto">
              <div>
                <IoInformation className="text-[#f68634] border border-[#f68634] w-8 h-8 rounded-sm cursor-pointer hover:bg-[#f68634] hover:text-white transition-colors duration-300" />
              </div>

              <AddToCartButton
                match_id={match.id}
                user_id={user?.id}
                area="C"
                price={50000}
              />
            </div>
          </div>

          <div className="flex p-4 border-l-6 border-l-green-600 border-t-2 border-t-gray-100">
            <Image
              src="/images/logo-shb-da-nang-ticket.png"
              alt="Logo SHB Đà Nẵng Ticket"
              width={80}
              height={80}
              className="mr-4"
            />
            <div>
              <div className="text-sm font-semibold">Khán đài D</div>
              <div className="text-sm">
                50.000 VNĐ <span className="text-gray-500">( Gồm 8% VAT )</span>
              </div>
            </div>
            <div className="grid gap-y-2 ml-auto">
              <div>
                <IoInformation className="text-[#f68634] border border-[#f68634] w-8 h-8 rounded-sm cursor-pointer hover:bg-[#f68634] hover:text-white transition-colors duration-300" />
              </div>

              <AddToCartButton
                match_id={match.id}
                user_id={user?.id}
                area="D"
                price={50000}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Match;
