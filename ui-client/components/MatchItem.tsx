import { IMatchProps } from "@/types/match.type";
import Image from "next/image";
import Link from "next/link";

const MatchItem = ({ match }: IMatchProps) => {
  const awayLogo = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${match.image_away_team}`;

  return (
    <div className="flex mt-8 pt-8 border-t-2 border-gray-100">
      {/* Left League Info */}
      <div className="pr-4 border-r-2 border-gray-100 text-center">
        <Image
          src="/images/logo-v.league.png"
          alt="Logo League"
          width={100}
          height={50}
        />
        <div className="mt-1 font-semibold">V.League 1</div>
      </div>

      {/* Right Content */}
      <div className="flex-1 px-10">
        <div>{match.time}</div>

        <div className="flex items-center">
          {/* Home name */}
          <div className="flex-1 text-xl font-semibold">SHB Đà Nẵng</div>

          {/* Home logo */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/images/logo-shb-da-nang.png"
              alt="Logo SHB Đà Nẵng"
              width={50}
              height={50}
            />
          </div>

          {/* VS */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/images/logo-vs.png"
              alt="Versus"
              width={40}
              height={40}
            />
          </div>

          {/* Away logo */}
          <div className="flex-1 flex justify-center">
            <Image
              src={awayLogo}
              alt={match.away_team}
              width={50}
              height={50}
              unoptimized
            />
          </div>

          {/* Away name */}
          <div className="flex-1 text-xl font-semibold">{match.away_team}</div>

          {/* Button */}
          <div className="flex-1 flex justify-end">
            <Link
              href={`/${match.slug_match}`}
              className="bg-[#f68634] text-white px-4 py-2 rounded-md hover:bg-[#e36b0f]"
            >
              Đặt vé
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchItem;
