import React, { useState } from "react";
import "../css/app.scss"; // import CSS custom nếu có

import logoTima from "../pages/images/logo_tima-invest.png";

import { openWebview } from "zmp-sdk";
import { TextSlider } from "./slider";
import { Invest } from "./invest";

const LoanPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loanType, setLoanType] = useState("");

  // Các field form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email , setEmail] = useState("");
  const [refphone, setRefphone] = useState("");
  const [loanPackage, setLoanPackage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const PHONE_REGEX = /^0\d{9}$/;

  const [phoneError, setPhoneError] = useState("");

  

 
  const handleSubmit = async (e: any) => {
  e.preventDefault();
  
  // 1. Validate input
  if (!PHONE_REGEX.test(phone)) {
    alert("Số điện thoại không hợp lệ");
    return;
  }

  if (isSubmitting) return;

  setIsSubmitting(true);
  setBlocking(true); // 🔒 block toàn màn hình

  try {
    const payload = {
      fullName: name,
      Phone: phone,
      RefCode: refphone,
      Email:email,
      SourceCreated: "zalo-oa",
    };

    // 1. Check phone
    const checkRes = await fetch(
      "https://n8n.anntech.one/webhook/check_exis_phonenb_los_test",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: payload.Phone }),
      }
    );

    if (!checkRes.ok) {
      throw new Error("Check phone failed");
    }

    const checkResult = await checkRes.json();

    if (checkResult.response === "1") {
      alert("Số điện thoại đã tồn tại trong hệ thống");
      return;
    }

    // 2. Create loan
    const res = await fetch(
      "https://crmlenderapi.tima.vn/api/v1.0/LenderInformation/create",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJtb2JpbGVhcHAiLCJkYXRlIjoxNTE2MjM5MDIyfQ.J37ZXbdRabXYgtqE_NV7--0lZZqs_qMtO2JfCGczpZE",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      throw new Error("Create loan failed");
    }

    alert("Đăng ký thành công!");

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
    <div className="bg-orange-50 pb-2">
      {/* Logo */}
      <div className="box-product">
        <div className="">
          <div className="logo-tima text-center w-100-l">
            <div style={{ width: "30%" }}>
              <img src={logoTima} alt="Logo Tima" />
            </div>
          </div>

          {/* Wrapper: banner + slider để dots đè lên banner */}
          <div className="relative">
            {/* Banner */}
            <div className="p-4 text-white text-center font-semibold text-lg bg-tima-orange shadow"
              style={{ textShadow: "2px 2px 4px rgb(22 2 2 / 88%)" }}>
              Đăng ký Online - giải ngân trong 2 giờ
            </div>

            {/* Slider đè lên banner (dots nằm trên vùng banner) */}
            <div className="relative -mt-6 z-10">
              <TextSlider />
            </div>
          </div>

          {/* khoan vay */}
          <Invest />

          <form className="right-content-product-header p-2 bg-white border rounded mx-2 mt-2  text-center"  onSubmit={handleSubmit}>
            <div className="box-register-loan">
              <div className="title-box-register-loan pt-2">
                   <span className="colorTima text-lg font-bold">LỢI NHUẬN LÊN TỚI 15,5%/ NĂM</span> 
                    <p className="text-sm font-bold">Khi đầu tư cho vay ngang hàng (P2P Lending)</p>
                    <p className="text-xs">500,000+ người đã tin tưởng và đầu tư thành công tại Tima</p>
              </div>
             
              {/* Input họ tên */}
              <div className="box-form-register-loan p-2 text-sm mt-2">
                <input
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                   placeholder="Nhập họ và tên *"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Input số điện thoại */}
              <div className="box-form-register-loan p-2 text-sm">
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

               {/* Input email */}
              <div className="box-form-register-loan p-2 text-sm">
                <input
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                   placeholder="Nhập email nhà đầu tư *"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* SDT nguoi gioi thieu */}
              <div className="box-form-register-loan p-2 text-sm">
                <input
                  value={refphone}
                  onChange={(e) => setRefphone(e.target.value)}
                   placeholder="Nhập số điện thoại người giới thiệu (nếu có)"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="box-form-register-loan p-2">
                <button
                  type="submit"
                  className="btn btn-register bg-[#f88e51] p-2 w-full rounded font-bold "
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
                    "Đăng ký tư vấn ngay"
                  )}
                </button>
              </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanPage;
