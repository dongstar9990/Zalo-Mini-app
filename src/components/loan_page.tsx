import React, { useEffect, useState } from "react";
import "../css/app.scss"; // import CSS custom nếu có
import { TextSlider } from "./slider";
import iconOrange from '../pages/images/icon-orange.png';
import phoneStepBorrow from '../pages/images/phone-step-borow-4.png';   
import logoTima from '../pages/images/logo-tima.png';  
import Imgxemay from '../pages/images/vay-dkxemay.png'; 
import Imgoto from '../pages/images/vay-dkxoto.png'; 

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



  // xử lý sự kiện button submit
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
      let productID_pk;

      if (loanPackage === "1") productID_pk = 2;
      else if (loanPackage === "2") productID_pk = 8;

      let productID;
      if (loanType === "Vay bằng đăng ký ô tô") productID = 8;
      else if (loanType === "Vay mua ô tô") productID = 31;
      else if (loanType === "Vay bằng đăng ký xe máy") productID = 2;
      else if (loanType === "Khác") productID = productID_pk;

      // Lấy tên tỉnh từ provinceId
      const selectedProvince = provinces.find(
     (x) => x.provinceId === Number(provinceId)
    );
    const selectedProvinceName = selectedProvince ? selectedProvince.name : "";
    // Làm sạch tên tỉnh và quận huyện trước khi gửi lên API
    const cleanProvince = (selectedProvince?.name || "")
    .replace("Tỉnh ", "")
    .replace("Thành phố ", "");
// Làm sạch tên quận huyện
    const cleanDistrict = district
      .replace("Xã ", "")
      .replace("Phường ", "")
      .replace("Thị trấn ", "");

      const payload = {
        productId: productID,
        fullName: name,
        phone,
        provinceName: cleanProvince,
        partnerName: "Zalo OA",
        districtName: cleanDistrict,
        nationalCard: null,
        loanAmount: null,
        affSId: null,
      };
      //1.Call api gọi tỉnh



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

  return (
    
    <div className="bg-orange-50 min-h-screen" style={{width:"100%" ,overflowX:"hidden"}}>
     
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
 
          {/* Loan options */}
          <div className="box-product-default">
            <div className="box-default loan-option">
              <a
                className="a-box-default"
                onClick={() => openModal("Vay bằng đăng ký xe máy")}
                style={{ width: "95%" }}
              >
                <div className="icon" style={{ display: "flex", justifyContent: "center" }}>

                    <img src={Imgxemay}   className="vay-mua-oto"/>
                </div>
                 <div className="text">
                  <h3><span className="top">Vay bằng đăng ký xe máy</span></h3>
                </div> 
              </a>
            </div>

            <div className="box-default loan-option">
              <a
                className="a-box-default"
                onClick={() => openModal("Vay bằng đăng ký ô tô")}
                style={{ width: "95%" }}
              >
                <div className="icon">
                  <img src={Imgoto} />
                </div>
                <div className="text">
                  <h3><span className="top">Vay bằng đăng ký ô tô</span></h3>
                </div>
              </a>
            </div>
            {/* <div className="box-default loan-option">
              <a
                className="a-box-default"
                onClick={() => openModal("Khác")}
                style={{ width: "95%" }}
              >
                <div className="icon">
                  <img src={khacImg} />
                </div>
                <div className="text">
                  <h3><span className="top">Khác</span></h3>
                </div>
              </a>
            </div> */}
          </div>
        </div>
      </div>
    <div  style={{width:"100%",float:"left"}}>
      <div className="title font-bold text-center mt-6 mb-4 text-black">
            <h2 style={{ fontSize: "18px"}}>
              Ưu điểm vay<strong className="colorTima"> Online Nhanh tại Tima</strong>
            </h2>
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

      {/* ========== NÚT TẢI APP ========== */}
      {!modalOpen && (
      <div className="mx-3 mt-6 space-y-3">
        <button
       onClick={() => openModal("Vay bằng đăng ký ô tô")}
        className="fixed-btn w-full bg-tima-orange text-white font-bold py-2 rounded" 
        >
        Đăng ký ngay
        </button>
      </div>
      )}
      {/* ========== MODAL ========== */}
      {modalOpen && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-black">Bạn đang cần khoản vay</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* LOẠI VAY */}
              <div className="mb-3">
                <label className="block text-gray-700">Loại vay</label>
                {/* <input
                  value={loanType}
                  readOnly
                  className="w-full border rounded px-3 py-2"
                /> */}
                  <select
                    className="w-full border rounded px-3 py-2 loan-option text-black"
                    value={loanType}
                    onChange={(e) => {
                      setLoanType(e.target.value);
                      openModal(e.target.value);
                    }}
                    required
                  >
                  <option value="" disabled>
                    Chọn hình thức vay
                  </option>
                  {/* <option value="Vay mua ô tô">Vay mua ô tô</option> */}
                  <option value="Vay bằng đăng ký xe máy">Vay bằng đăng ký xe máy</option>
                  <option value="Vay bằng đăng ký ô tô">Vay bằng đăng ký ô tô</option>
                </select>

              </div>

              {/* HỌ TÊN */}
              <div className="mb-3 text-black">
                <label className="block text-gray-700">Họ và tên</label>
                <input
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* ĐIỆN THOẠI */}
              <div className="mb-3 text-black">
                <label className="block text-gray-700">Số điện thoại</label>
                <input
                  value={phone}
                  required
                  maxLength={10}
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // chỉ cho số
                    setPhone(value);
                  }}
                  className={`w-full border rounded px-3 py-2 ${
                    phoneError ? "border-red-500" : ""
                  }`}
                />

                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              {/* TỈNH THÀNH */}
              <div className="mb-3 text-black">
                <label className="block text-gray-700">Tỉnh / Thành phố</label>
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
              {/* QUẬN/HUYỆN */}
              <div className="mb-3 text-black">
                <label className="block text-gray-700">Quận / Huyện</label>
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

              {/* GÓI VAY */}
              {showLoanPackage && (
                <div className="mb-3">
                  <label className="block text-gray-700">Gói vay</label>
                  <select
                    value={loanPackage}
                    onChange={(e) => setLoanPackage(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required={requiredLoanPackage}
                  >
                    <option value="">-- Chọn gói vay --</option>
                    <option value="1">Vay đến 30 triệu</option>
                    <option value="2">Vay đến 2 tỷ</option>
                  </select>
                </div>
              )}

              {/* MÃ GIỚI THIỆU */}
              {/* {showReferral && (
                <div className="mb-3">
                  <label className="block text-gray-700">Mã giới thiệu (nếu có)</label>
                  <input
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )} */}

              {/* CHECK CÀ VẸT */}
              {/* {showCarReg && (
                <div className="mb-3 flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={agreeCarReg}
                    onChange={(e) => setAgreeCarReg(e.target.checked)}
                    required={requiredCarReg}
                  />
                  <span className="text-sm text-gray-700">
                    Tôi xác nhận có cà vẹt xe ô tô
                  </span>
                </div>
              )} */}

              {/* ĐỒNG Ý ĐIỀU KHOẢN */}
              <div className="mb-3 flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <span className="text-sm text-gray-700">
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

              </div>

             <button
                type="submit"
                className="w-full bg-tima-orange text-white font-bold py-2 rounded flex justify-center items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
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

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPage;
