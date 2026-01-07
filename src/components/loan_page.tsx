import React, { useState } from "react";
import "../css/app.scss"; // import CSS custom nếu có

import vayOtoImg from '../pages/images/vayoto.svg';
import vayBangOtoImg from '../pages/images/vay-mua-to.svg';
import khacImg from '../pages/images/khac.svg';

import iconOrange from '../pages/images/icon-orange.png';
import phoneStepBorrow from '../pages/images/phone-step-borow-4.png';   

import logoTima from '../pages/images/logo-tima.png';  

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

    if (type === "Vay bằng cà vẹt ô tô") {
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
  setBlocking(true); // 🔒 block toàn màn hình

  try {
    let productID_pk;

    if (loanPackage === "1") productID_pk = 2;
    else if (loanPackage === "2") productID_pk = 8;

    let productID;
    if (loanType === "Vay bằng cà vẹt ô tô") productID = 8;
    else if (loanType === "Vay mua ô tô") productID = 31;
    else if (loanType === "Khác") productID = productID_pk;

    const payload = {
      productId: productID,
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
    <div className="bg-orange-50">
      {/* Logo */}
      <div className="box-product">
        <div className="">
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
                className="a-box-default active"
                onClick={() => openModal("Vay mua ô tô")}
                style={{ width: "95%" }}
              >
                <div className="icon" style={{ display: "flex", justifyContent: "center" }}>

                    <img src={vayOtoImg}  style={{width:"60%"}} className="vay-mua-oto"/>
                </div>
                 <div className="text">
                  <h3><span className="top">Vay mua ô tô</span></h3>
                </div> 
                

              </a>
            </div>

            <div className="box-default loan-option">
              <a
                className="a-box-default"
                onClick={() => openModal("Vay bằng cà vẹt ô tô")}
                style={{ width: "95%" }}
              >
                <div className="icon">
                  <img src={vayBangOtoImg} />
                </div>
                <div className="text">
                  <h3><span className="top">Vay bằng cà vẹt ô tô</span></h3>
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

      {/* Download MyTima */}
      <div className="box-install-mytima-mobile">
        <div className="container-install">
          <div className="title">
            <h2 style={{ fontSize: "18px" }}>
              Ưu điểm vay <strong className="colorTima">Online Nhanh tại Tima</strong>
            </h2>
          </div>

          {/* icon list */}
          {[
            {
              img: icon01,
              title: "Duyệt vay nhanh",
              desc: "Nhận tiền trong 2 giờ kể từ khi đăng ký",
            },
            {
              img: icon02,
              title: "Hạn mức vay lớn",
              desc: "Lên đến 2 tỷ đồng, phù hợp với mọi nhu cầu tài chính",
            },
            {
              img: icon03,
              title: "Thủ tục tối giản",
              desc: "KHÔNG thẩm định, KHÔNG tra nợ xấu, KHÔNG chứng minh thu nhập.",
            },
            {
              img: icon04,
              title: "Bảo mật thông tin",
              desc: "Cam kết bảo mật tuyệt đối thông tin người vay theo quy định của nhà nước",
            },
          ].map((item, i) => (
            <div className="content" key={i}>
              <div className="icon">
                <img src={item.img} width="48px" alt={item.title}/>
              </div>
              <div className="text">
                <h3>{item.title}</h3>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}

            {/* QR Download */}
            {/* <div className="content-right-install-mytima-product">
            <div className="box-qr-mytima">
                <div className="left-qr-mytima">
                <div
                    onClick={() =>
                        zmp.openWebview({
                        url: "https://redirect.appmetrica.yandex.com/serve/678108671904922699",
                        })
                    }
                    style={{ cursor: "pointer" }}
                    >
                    <img src={downloadAppImg} alt="Download My Tima" />
                    </div>
                <br />
                <span>Quét mã QR để tải ngay ứng dụng My Tima</span>
                </div>
                <div className="right-qr-mytima">
                <img src={qrMyTima} alt="QR My Tima" />
                </div>
            </div>
            </div> */}


        </div>
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
        
       onClick={() => openModal("Vay bằng cà vẹt ô tô")}

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
              <h3 className="text-lg font-semibold">Bạn đang cần khoản vay</h3>
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
                    className="w-full border rounded px-3 py-2 loan-option"
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
                  <option value="Vay mua ô tô">Vay mua ô tô</option>
                  <option value="Vay bằng cà vẹt ô tô">Vay bằng cà vẹt ô tô</option>
                </select>

              </div>

              {/* HỌ TÊN */}
              <div className="mb-3">
                <label className="block text-gray-700">Họ và tên</label>
                <input
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* ĐIỆN THOẠI */}
              <div className="mb-3">
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
              <div className="mb-3">
                <label className="block text-gray-700">Tỉnh / Thành phố</label>
                <select
                    value={province}
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
