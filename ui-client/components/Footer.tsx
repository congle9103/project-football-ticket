import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#f68634] text-white mt-8">
      <div className="max-w-7xl mx-auto px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* LOGO */}
          <div className="flex justify-center md:justify-start">
            <Image
              src="/images/logo-shb-da-nang.png"
              alt="SHB Đà Nẵng"
              width={200}
              height={200}
            />
          </div>

          {/* ĐIỀU HƯỚNG */}
          <div>
            <h3 className="font-bold mb-4 uppercase">Điều hướng</h3>
            <ul className="space-y-2">
              <li>Trang chủ</li>
              <li>Lịch thi đấu</li>
              <li>Về chúng tôi</li>
              <li>Chính sách bán hàng</li>
              <li>Chính sách bảo hành</li>
              <li>Chính sách bảo mật thông tin</li>
              <li>Quy trình xử lý khiếu nại</li>
            </ul>
          </div>

          {/* LIÊN HỆ */}
          <div>
            <h3 className="font-bold mb-4 uppercase">Liên hệ</h3>
            <p className="mb-2 font-semibold">
              CÔNG TY CỔ PHẦN THỂ THAO SHB ĐÀ NẴNG
            </p>
            <p className="mb-2">
              Địa chỉ: Tổ 137 Đà Sơn, phường Hòa Khánh Nam, Liên Chiểu, TP Đà
              Nẵng, Việt Nam
            </p>
            <p className="mb-2">Email: contact@shbdanangfc.com.vn</p>
            <p className="mb-4">Hotline: 02366558333</p>

            <div className="flex gap-4">
              <FaFacebookF className="cursor-pointer" />
              <FaInstagram className="cursor-pointer" />
              <FaYoutube className="cursor-pointer" />
            </div>
          </div>

          {/* GIẤY PHÉP */}
          <div>
            <h3 className="font-bold mb-4 uppercase">Giấy phép</h3>
            <p className="mb-2">Mã số thuế: 0400670263</p>
            <p className="mb-2">Ngày cấp lần đầu: 07/11/2008</p>
            <p>
              Nơi cấp: Sở Kế Hoạch Đầu Tư TP Đà Nẵng - Phòng đăng ký kinh doanh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
