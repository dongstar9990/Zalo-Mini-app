import React, { useEffect, useState } from "react";
import "../css/app.scss"; // import CSS custom nếu có
import { TextSlider } from "./slider";


import vayOtoImg from '../pages/images/vayoto.svg';
import vayBangOtoImg from '../pages/images/vay-mua-to.svg';
import khacImg from '../pages/images/khac.svg';

import img from '../pages/images/header-backgroud.png'; 

import iconOrange from '../pages/images/icon-orange.png';
import phoneStepBorrow from '../pages/images/phone-step-borow-4.png';   

import logoTima from '../pages/images/logo-tima.png';  

import { openWebview } from "zmp-sdk";

const LoanPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loanType, setLoanType] = useState("");

  // Các field form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [district, setDistrict] = useState("");// dữ liệu người dùng chọn
  const [referralCode, setReferralCode] = useState("");
  const [loanPackage, setLoanPackage] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeCarReg, setAgreeCarReg] = useState(false);

  //dữ liệu api đổ về
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

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
  //call api lấy tỉnh thành
useEffect(() =>{
    fetch("https://apiapplos.tima.vn/api/v1.0/landingpage/get_city_all")
    .then((res)=>res.json())
    .then((data) => {
      setProvinces(data.data)
    })
    .catch((err) => console.log(err));
},[]);
      //console.log(provinces);


// xử lý sự kiện khi chọn tỉnh thành, gọi api lấy quận huyện theo tỉnh
const handleProvinceChange = async (e: any) => {
  const selectedId = e.target.value;//lấy íd tỉnh thành người dùng chọn
  setProvinceId(selectedId);// lưu id tỉnh thành vào state

  // reset huyện
  setDistrict("");
  setDistricts([]);

  if (!selectedId) return;
  try{
    //cap api laays quận huyện theo tỉnh thành
    const res=await fetch(`https://apiapplos.tima.vn/api/v1.0/landingpage/get_district_all?provinceId=${selectedId}`);
    const data = await res.json();
    setDistricts(data.data);
  } catch (err) {
    console.log(err);
  }
  console.log(districts);
};

// Xử lý submit form đăng ký vay
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

          // Lấy tên tỉnh từ provinceId
      const selectedProvince = provinces.find(
     (x) => x.provinceId === Number(provinceId)
    );
    // Làm sạch tên tỉnh và quận huyện trước khi gửi lên API
    const cleanProvince = (selectedProvince?.name || "")
    .replace("Tỉnh ", "")
    .replace("Thành phố ", "");
// Làm sạch tên quận huyện
    const cleanDistrict = district
      .replace("Xã ", "")
      .replace("Phường ", "")
      .replace("Thị trấn ", "");


    try {

      const payload = {
        productId: 8,
        fullName: name,
        phone,
        provinceName: cleanProvince,
        partnerName: "Zalo OA",
        districtName: cleanDistrict,
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
    
    <div className="bg-orange-50 min-h-screen " style={{width:"100%" ,overflowX:"hidden"}}>
     
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
              <div className="box-form-register-loan text-black">
                <input
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                   placeholder="Nhập họ và tên *"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Input số điện thoại */}
              <div className="box-form-register-loan text-black">
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
                    value={provinceId}
                    required
                    onChange={handleProvinceChange}
                    className="w-full border rounded px-3 py-2 text-black"
                    >
                      <option value="">-- Chọn tỉnh/thành --</option>
                    {
                      provinces.map((items)=>(
                        <option key={items.provinceId} value={items.provinceId}>
                            {items.name}
                        </option>
                      ))
                    }
                    </select>
              </div>
              {/* Select huyện */}
              <div className="box-form-register-loan">
                <select
                  value={district}
                  required
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-black"
                >
                  <option value="">-- Chọn quận/huyện --</option>
                  {districts.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
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
      <div className="title font-bold text-center mt-6 mb-4 mx-8 text-black" style={{padding:"0 40px"}}>
            <h2 style={{ fontSize: "18px"}}>
              Ưu điểm gói vay Tima<strong className="colorTima"> </strong>
            </h2>
            <span className="italic font-normal text-sm text-black">Địa chỉ vay bằng đăng ký/ cavet uy tín số 1 Việt Nam</span>
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