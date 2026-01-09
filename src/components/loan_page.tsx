import React, { useState } from "react";
import "../css/app.scss"; // import CSS custom nếu có
import { TextSlider } from "./slider";


import vayOtoImg from '../pages/images/vayoto.svg';
import vayBangOtoImg from '../pages/images/vay-mua-to.svg';
import khacImg from '../pages/images/khac.svg';

import img from '../pages/images/header-backgroud.png'; 

import iconOrange from '../pages/images/icon-orange.png';
import phoneStepBorrow from '../pages/images/phone-step-borow-4.png';   

import logoTima from '../pages/images/logo-tima.png';  
import Imgxemay from '../pages/images/vay-dkxemay.png'; 
import Imgoto from '../pages/images/vay-dkxoto.png'; 


import icon01 from '../pages/images/icon-01.png';
import icon02 from '../pages/images/icon-02.png';
import icon03 from '../pages/images/icon-03.png';
import icon04 from '../pages/images/icon-04.png';

import qrMyTima from '../pages/images/qr-mytima.png';
import downloadAppImg from '../pages/images/icon-download.png';
import zmp from "zmp-sdk";
import { openWebview } from "zmp-sdk";

const LoanPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loanType, setLoanType] = useState("");

  // Các field form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loanPackage, setLoanPackage] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeCarReg, setAgreeCarReg] = useState(false);

  // Điều khiển ẩn/hiện
  const [showReferral, setShowReferral] = useState(true);
  const [showCarReg, setShowCarReg] = useState(false);
  const [showLoanPackage, setShowLoanPackage] = useState(false);

  // Required
  const [requiredCarReg, setRequiredCarReg] = useState(false);
  const [requiredLoanPackage, setRequiredLoanPackage] = useState(false);

  const [selectLoanOpen, setSelectLoanOpen] = useState(false);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const PHONE_REGEX = /^0\d{9}$/;

  const [phoneError, setPhoneError] = useState("");

  const openModal = (type: string) => {
    setLoanType(type);
    setModalOpen(true);

    // Reset mặc định
    setShowReferral(true);
    setShowCarReg(false);
    setShowLoanPackage(false);
    setRequiredCarReg(false);
    setRequiredLoanPackage(false);

    if (type === "Vay bằng đăng ký ô tô") {
      setShowReferral(false);
      setShowCarReg(true);
      setRequiredCarReg(true);
    } else if (type === "Khác") {
      setShowReferral(false);
      setShowLoanPackage(true);
      setRequiredLoanPackage(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setName("");
    setPhone("");
    setProvince("");
    setReferralCode("");
    setLoanPackage("");
    setAgreeTerms(false);
    setAgreeCarReg(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // 1. Validate input
    if (!PHONE_REGEX.test(phone)) {
      alert("Số điện thoại không hợp lệ");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setBlocking(true);
    try {

      const payload = {
        productId: 8,
        fullName: name,
        phone,
        provinceName: province,
        partnerName: "Zalo OA",
        districtName: null,
        nationalCard: null,
        loanAmount: null,
        affSId: null,
      };

      // 1. Check phone
      const checkRes = await fetch(
        "https://n8n.anntech.one/webhook/check_exis_phonenb_los",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: payload.phone }),
        }
      );

      if (!checkRes.ok) {
        throw new Error("Check phone failed");
      }

      const checkResult = await checkRes.json();

      if (checkResult.response === "1") {
        alert("Số điện thoại đã tồn tại trong hệ thống");
        setIsSubmitting(false);
        setBlocking(false);
        return;
      }

      // 2. Create loan
      const res = await fetch(
        "https://apilos.tima.vn/api/v1.0/affiliatetima/create_loan_tima",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWZmaWxpYXRlIERlZmF1bHQifQ.FoV43lkNp8clweHhEfiItLVoQJHMDI4rYxvXg3ay2mM",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Create loan failed");
      }
      const result = await res.json();
      // Đã có khoản vay đang xử lý
      if (result?.meta?.errorCode === 201) {
        alert("Không thuộc khu vực hỗ trợ");
        return;
      }

      // Các lỗi khác
      if (result?.meta?.errorCode !== 200) {
        alert("Tạo đơn thất bại, vui lòng thử lại");
        return;
      }

      alert("Đăng ký thành công!");
      closeModal();

    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      // 🔓 LUÔN MỞ KHÓA Ở ĐÂY
      setIsSubmitting(false);
      setBlocking(false);
    }
  };




//   const handleDownload = () => {
//     const userAgent = navigator.userAgent;

//     let url = "https://tima.vn/app-download";

//     if (/iPad|iPhone|iPod/.test(userAgent)) {
//       url = "https://apps.apple.com/vn/app/my-tima/id6463413676?l=vi";
//     } else if (/android/i.test(userAgent)) {
//       url = "https://play.google.com/store/apps/details?id=com.mytima";
//     }

//     window.location.href = url;
//   };

  return (
    
    <div className="bg-orange-50" style={{width:"100%" ,overflowX:"hidden"}}>
     
      {/* Logo */}
      <div className="box-product"  style={{width:"100%",float:"left"}}>
        <div className="" style={{width:"100%",float:"left"}}>
          <div className="logo-tima text-center w-100-l">
            <div style={{ width: "30%" }}>
              <img src={logoTima} />
            </div>
          </div>


          {/* Banner */}
          <div className="p-4 text-white text-center font-semibold text-lg bg-tima-orange shadow"
            style={{ textShadow: "2px 2px 4px rgb(22 2 2 / 88%)" }}>
            Đăng ký Online - giải ngân trong 2 giờ
          </div>
 
          {/* from đăng ký vay */}
          <form className="right-content-product-header" style={{ backgroundImage: `url(${img})` }} onSubmit={handleSubmit}>
            <div className="box-register-loan">
              <div className="title-box-register-loan">
                <label>
                  Bạn đang <span className="colorTima">cần một khoản</span> vay?
                </label>
              </div>
              <div className="desc-box-register-loan">
                <label>
                  500,000+ người vay thành công, Tima không thu bất kỳ khoản tiền nào
                  trước khi giải ngân.
                </label>
              </div>
              {/* Input họ tên */}
              <div className="box-form-register-loan">
                <input
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                   placeholder="Nhập họ và tên *"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Input số điện thoại */}
              <div className="box-form-register-loan">
                <input
                  value={phone}
                  required
                  placeholder="Nhập số điện thoại *"
                  inputMode="numeric"
                  onChange={(e) => {
                  const value = e.target.value;
                  setPhone(value);

                  if (!/^\d*$/.test(value)) {
                    setPhoneError("Chỉ được nhập số");
                  } 
                  else if (value.length > 10) {
                    setPhoneError("Số điện thoại tối đa 10 số");
                  } 
                  else if (value.length === 10 && !PHONE_REGEX.test(value)) {
                    setPhoneError("Số điện thoại không hợp lệ");
                  } 
                  else {
                    setPhoneError("");
                  }
                }}
                  className={`w-full border rounded px-3 py-2 ${
                    phoneError ? "border-red-500" : ""
                  }`}
                />

                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              {/* Select tỉnh thành */}
              <div className="box-form-register-loan">
                <select
                    required
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    
                    >
                    <option value="">-- Chọn tỉnh/thành --</option>
                    <option value="An Giang">An Giang</option>
                    <option value="Bà Rịa – Vũng Tàu">Bà Rịa – Vũng Tàu</option>
                    <option value="Bắc Giang">Bắc Giang</option>
                    <option value="Bắc Kạn">Bắc Kạn</option>
                    <option value="Bạc Liêu">Bạc Liêu</option>
                    <option value="Bắc Ninh">Bắc Ninh</option>
                    <option value="Bến Tre">Bến Tre</option>
                    <option value="Bình Định">Bình Định</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Bình Phước">Bình Phước</option>
                    <option value="Bình Thuận">Bình Thuận</option>
                    <option value="Cà Mau">Cà Mau</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Đắk Lắk">Đắk Lắk</option>
                    <option value="Đắk Nông">Đắk Nông</option>
                    <option value="Điện Biên">Điện Biên</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                    <option value="Đồng Tháp">Đồng Tháp</option>
                    <option value="Gia Lai">Gia Lai</option>
                    <option value="Hà Giang">Hà Giang</option>
                    <option value="Hà Nam">Hà Nam</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hà Tĩnh">Hà Tĩnh</option>
                    <option value="Hải Dương">Hải Dương</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Hậu Giang">Hậu Giang</option>
                    <option value="Hòa Bình">Hòa Bình</option>
                    <option value="Hưng Yên">Hưng Yên</option>
                    <option value="Khánh Hòa">Khánh Hòa</option>
                    <option value="Kiên Giang">Kiên Giang</option>
                    <option value="Kon Tum">Kon Tum</option>
                    <option value="Lai Châu">Lai Châu</option>
                    <option value="Lâm Đồng">Lâm Đồng</option>
                    <option value="Lạng Sơn">Lạng Sơn</option>
                    <option value="Lào Cai">Lào Cai</option>
                    <option value="Long An">Long An</option>
                    <option value="Nam Định">Nam Định</option>
                    <option value="Nghệ An">Nghệ An</option>
                    <option value="Ninh Bình">Ninh Bình</option>
                    <option value="Ninh Thuận">Ninh Thuận</option>
                    <option value="Phú Thọ">Phú Thọ</option>
                    <option value="Phú Yên">Phú Yên</option>
                    <option value="Quảng Bình">Quảng Bình</option>
                    <option value="Quảng Nam">Quảng Nam</option>
                    <option value="Quảng Ngãi">Quảng Ngãi</option>
                    <option value="Quảng Ninh">Quảng Ninh</option>
                    <option value="Quảng Trị">Quảng Trị</option>
                    <option value="Sóc Trăng">Sóc Trăng</option>
                    <option value="Sơn La">Sơn La</option>
                    <option value="Tây Ninh">Tây Ninh</option>
                    <option value="Thái Bình">Thái Bình</option>
                    <option value="Thái Nguyên">Thái Nguyên</option>
                    <option value="Thanh Hóa">Thanh Hóa</option>
                    <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                    <option value="Tiền Giang">Tiền Giang</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Trà Vinh">Trà Vinh</option>
                    <option value="Tuyên Quang">Tuyên Quang</option>
                    <option value="Vĩnh Long">Vĩnh Long</option>
                    <option value="Vĩnh Phúc">Vĩnh Phúc</option>
                    <option value="Yên Bái">Yên Bái</option>
                </select>
              </div>
              
              <div className="box-form-register-loan m-l-10">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <span className="text-sm text-gray-700 pl-2">
                  Tôi đồng ý với{" "}
                  <span
                    onClick={() =>
                      openWebview({
                        url: "https://cdn.tima.vn/file-pdf/20240509_DIEU_KHOAN_VA_DIEU_KIEN_TIMA.pdf",
                      })
                    }
                    className="text-orange-500 font-bold hover:text-orange-600 underline"
                  >
                    điều khoản và điều kiện
                  </span>{" "}
                  của Tima
                </span>
                <button
                type="submit"
                className="btn btn-register"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center w-full">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đăng ký vay"
                )}
              </button>
              </div>
             
            </div>
          </form>

        </div>
      </div>
    <div  style={{width:"100%",float:"left"}}>
      <div className="title font-bold text-center mt-6 mb-4 mx-8" style={{padding:"0 40px"}}>
            <h2 style={{ fontSize: "18px"}}>
              Ưu điểm gói vay Tima<strong className="colorTima"> </strong>
            </h2>
            <span className="italic font-normal text-sm">Địa chỉ vay bằng đăng ký/ cavet uy tín số 1 Việt Nam</span>
      </div>
      <TextSlider />
    </div>
                

      {/* Steps */}
      <div className="box-step-borrow-mobile">
        <div className="">
          <div className="title">
            <h2 style={{ fontSize: "18px" ,color: "black" }}>
              Chỉ với <strong className="colorTima">04 bước đơn giản</strong> bạn đã được vay!
            </h2>
          </div>

          <div className="left">
            {[
              {
                title: "01. Đăng ký vay",
                desc: "Hoàn tất điền thông tin chỉ trong 30 giây",
              },
              {
                title: "02. Chuẩn bị hồ sơ",
                desc: "Đăng ký xe máy hoặc Giấy đăng ký ô tô",
              },
              {
                title: "03. Nhận xét duyệt",
                desc: "Nhận kết quả nhanh chóng sau khi nộp hồ sơ",
              },
              {
                title: "04. Nhận khoản vay",
                desc: "Giải ngân qua tài khoản ngân hàng",
              },
            ].map((item, i) => (
              <div className="w-100-l p-t-20" key={i}>
                <div className="icon">
                  <img src={iconOrange} />
                </div>
                <div className="text">
                  <h3 className="title-content-box-step-borrow" style={{ color: "black" }}>
                    {item.title}
                  </h3>
                  <p className="desc-content-box-step-borrow" style={{ color: "white" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="right">
            <img src={phoneStepBorrow} />
          </div>
        </div>
      </div>

     
      
    </div>
  );
};

export default LoanPage;