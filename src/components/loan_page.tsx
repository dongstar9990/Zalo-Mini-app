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
          let productID;
          if (loanType === "Vay bằng cà vẹt ô tô") productID = 8;
          else if (loanType === "Vay mua ô tô") productID = 31;
          else if (loanType === "Vay bằng cà vẹt xe máy") productID = 2;


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
          <div className="right-content-product-header" style={{ backgroundImage: `url(${img})` }}>
            <div className="title-box-register-loan">
                <label>
                  <span className="colorTima">Định Giá Xe</span> Đã Qua Sử Dụng
                </label>
                <p>
                  500,000+ người vay thành công, Tima không thu bất kỳ khoản tiền nào
                  trước khi giải ngân.
                </p>
              
              </div>
              {/* {form định giá xe} */}
        <form className="boxFormValuation w-100-l">
          <div className="choose-vehicle w-100-l">
            <div className="w-100-l">
              <div className="w-50-l">
                <label>Chọn phương tiện</label>
              </div>
              <div className="w-50-l text-center">
                <input
                  type="radio"
                  id="rd_Car"
                  name="radio_choose_car"
                  defaultValue={8}
                  // defaultChecked="checked"
                />
                <label htmlFor="radio_choose_car" className="m-l-10">
                  Ô tô
                </label>
                <br />
              </div>
            </div>
          </div>
          <div className="w-100-l p-t-10">
            <label>Hãng xe</label>
            <select
              className="custom-select select2-hidden-accessible"
              id="sl_Brand"
              style={{ width: "100%" }}
              // onchange="Lib.GetYearCar(this.value, '#sl_Year', '#sl_Vehicles')"
              tabIndex={-1}
              aria-hidden="true"
            ></select>
            <span
              className="select2 select2-container select2-container--default"
              dir="ltr"
              style={{ width: "100%" }}
            >
              <span className="selection">
                <span
                  className="select2-selection select2-selection--single"
                  role="combobox"
                  aria-haspopup="true"
                  aria-expanded="false"
                  tabIndex={0}
                  aria-labelledby="select2-sl_Brand-container"
                >
                  <span
                    className="select2-selection__rendered"
                    id="select2-sl_Brand-container"
                  >
                    <span className="select2-selection__placeholder">Hãng xe *</span>
                  </span>
                  <span className="select2-selection__arrow" role="presentation">
                    <b role="presentation" />
                  </span>
                </span>
              </span>
              <span className="dropdown-wrapper" aria-hidden="true" />
            </span>
          </div>
          <div className="w-100-l p-t-10">
            <label>Năm sản xuất</label>
            <select
              className="custom-select select2-hidden-accessible"
              id="sl_Year"
              style={{ width: "100%" }}
              // onchange="Lib.GetVehiclesCar(this.value, '#sl_Brand', '#sl_Vehicles')"
              tabIndex={-1}
              aria-hidden="true"
            >
              <option />
            </select>
            <span
              className="select2 select2-container select2-container--default"
              dir="ltr"
              style={{ width: "100%" }}
            >
              <span className="selection">
                <span
                  className="select2-selection select2-selection--single"
                  role="combobox"
                  aria-haspopup="true"
                  aria-expanded="false"
                  tabIndex={0}
                  aria-labelledby="select2-sl_Year-container"
                >
                  <span
                    className="select2-selection__rendered"
                    id="select2-sl_Year-container"
                  >
                    <span className="select2-selection__placeholder">
                      Năm sản xuất *
                    </span>
                  </span>
                  <span className="select2-selection__arrow" role="presentation">
                    <b role="presentation" />
                  </span>
                </span>
              </span>
              <span className="dropdown-wrapper" aria-hidden="true" />
            </span>
          </div>
          <div className="w-100-l p-t-10">
            <label>Tên xe</label>
            <select
              className="custom-select select2-hidden-accessible"
              id="sl_Vehicles"
              style={{ width: "100%" }}
              tabIndex={-1}
              aria-hidden="true"
            >
              <option />
            </select>
            <span
              className="select2 select2-container select2-container--default"
              dir="ltr"
              style={{ width: "100%" }}
            >
              <span className="selection">
                <span
                  className="select2-selection select2-selection--single"
                  role="combobox"
                  aria-haspopup="true"
                  aria-expanded="false"
                  tabIndex={0}
                  aria-labelledby="select2-sl_Vehicles-container"
                >
                  <span
                    className="select2-selection__rendered"
                    id="select2-sl_Vehicles-container"
                  >
                    <span className="select2-selection__placeholder">Tên xe *</span>
                  </span>
                  <span className="select2-selection__arrow" role="presentation">
                    <b role="presentation" />
                  </span>
                </span>
              </span>
              <span className="dropdown-wrapper" aria-hidden="true" />
            </span>
          </div>
          <div className="w-100-l p-t-10">
            {/* <button type="button" onclick="HandlePrice(this, '#_i_loading_valuation')">
              Định giá xe <i id="_i_loading_valuation" className="" />
            </button> */}
            <button type="button" >
              Định giá xe <i id="_i_loading_valuation" className="" />
            </button>
          </div>
        </form>

          </div>

        </div>
      </div>
    <div  style={{width:"100%",float:"left"}}>
      <div className="title font-bold text-center mt-6 mb-4 mx-8" style={{padding:"0 40px"}}>
            <h2 style={{ fontSize: "18px"}}>
              Ưu điểm gói vay Tima<strong className="colorTima"> </strong>
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

     
      
    </div>
  );
};

export default LoanPage;