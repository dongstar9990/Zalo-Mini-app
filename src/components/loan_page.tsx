import React, { useEffect, useState } from "react";
import "../css/app.scss"; // import CSS custom nếu có
import { TextSlider } from "./slider";
import img from '../pages/images/header-backgroud.png'; 
import iconOrange from '../pages/images/icon-orange.png';
import phoneStepBorrow from '../pages/images/phone-step-borow-4.png';   
import logoTima from '../pages/images/logo-tima.png';  
import ImgDinhGia from '../pages/images/img-car.png';  




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

 const [brands, setBrands] = useState<string[]>([]);
 const [selectedBrand, setSelectedBrand] = useState<string>("");
 const [selectedYear, setSelectedYear] = useState<string>("");
 const [years, setYears] = useState<string[]>([]);
  const [selectedName, setSelectedNameCar] = useState<string>("");
 const [names, setNameCar] = useState<string[]>([]);


 // xử lý modal
 const [valuationModalOpen, setValuationModalOpen] = useState(false);
const [loanModalOpen, setLoanModalOpen] = useState(false);
const [valuationResult, setValuationResult] = useState<any>(null);
const [isValuating, setIsValuating] = useState(false);


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
  const [loading, setLoading] = useState(false);

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
    setLoanModalOpen(false); 
    setName("");
    setPhone("");
    setProvince("");
    setReferralCode("");
    setLoanPackage("");
    setAgreeTerms(false);
    setAgreeCarReg(false);
  };




// 1. Call API hãng xe
useEffect(() => {
  const getBrands = async () => {
    try {
      const res = await fetch(
        "https://apilos.tima.vn/api/v1.0/dictionary/get_brand_car",
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGltYVRlY2gifQ.BqBxbXL7AYGeOpKH2Slo57zq7zHTdLAHTjeeR4Qj_Hg",
          },
        }
      );

      // console.log("STATUS:", res.status);
      if (!res.ok) throw new Error(`HTTP ERROR ${res.status}`);

      const result = await res.json();
      console.log("DATA:", result);

      setBrands(result.data);   
    } catch (error) {
      console.error("API ERROR:", error);
    }
  };

  getBrands();
}, []);

// 2. Call API năm sản xuất khi chọn hãng xe
useEffect(() => {
  if (!selectedBrand) {
    setYears([]);
    setSelectedYear("");
    return;
  }

  const getYears = async () => {
    try {
      const res = await fetch(
        `https://apilos.tima.vn/api/v1.0/dictionary/get_year_car?brand=${selectedBrand}`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGltYVRlY2gifQ.BqBxbXL7AYGeOpKH2Slo57zq7zHTdLAHTjeeR4Qj_Hg",
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ERROR ${res.status}`);

      const result = await res.json();
      console.log("YEAR DATA:", result);

      setYears(result.data || []);
    } catch (error) {
      console.error("YEAR API ERROR:", error);
      setYears([]);
    }
  };

  getYears();
}, [selectedBrand]);

// 3. Call API tên xe (cần cả brand và year)
useEffect(() => {
  if (!selectedBrand || !selectedYear) {
    setNameCar([]);
    setSelectedNameCar("");
    return;
  }

  const getNameCars = async () => {
    try {
      const res = await fetch(
        `https://apilos.tima.vn/api/v1.0/dictionary/get_vehicles_car?brand=${selectedBrand}&year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGltYVRlY2gifQ.BqBxbXL7AYGeOpKH2Slo57zq7zHTdLAHTjeeR4Qj_Hg",
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ERROR ${res.status}`);

      const result = await res.json();
      console.log("NAME DATA:", result);

      setNameCar(result.data || []);
    } catch (error) {
      console.error("NAME API ERROR:", error);
      setNameCar([]);
    }
  };

  getNameCars();
}, [selectedBrand, selectedYear]);

//3.xu ly dinh gia xe
  const handleSubmitDinhGiaXe = async (e: any) => {
      e.preventDefault();
        
        // Validate
        if (!selectedBrand || !selectedYear || !selectedName) {
          alert("Vui lòng chọn đầy đủ thông tin xe");
          return;
        }

        if (isValuating) return;

        setIsValuating(true);
        try {
          const res = await fetch(
            `https://apilos.tima.vn/api/v1.0/dictionary/get_price_car?brand=${selectedBrand}&year=${selectedYear}&vehicles=${selectedName}`,
            {
              method: "GET",
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGltYVRlY2gifQ.BqBxbXL7AYGeOpKH2Slo57zq7zHTdLAHTjeeR4Qj_Hg",
              },
            }
          );

          if (!res.ok) throw new Error(`HTTP ERROR ${res.status}`);

          const result = await res.json();
          console.log("VALUATION DATA:", result);

          // Lưu kết quả và mở modal
          setValuationResult(result);
          setValuationModalOpen(true);
        } catch (error) {
          console.error("VALUATION API ERROR:", error);
          alert("Có lỗi xảy ra khi định giá xe, vui lòng thử lại");
        } finally {
          setIsValuating(false);
        }
  };

  const handleLoanSubmit = async (e: any) => {
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
          <div className="w-100-l right-content-product-header" style={{ backgroundImage: `url(${img})`,backgroundSize: "100% 100%" }}>
            <div className="text-center pt-4 px-8">
                <label className="text-center font-bold text-[20px] text-black">
                  <span className="colorTima ">Định Giá Xe</span> Đã Qua Sử Dụng
                </label>
                <p className="text-black">
                  500,000+ người vay thành công, Tima không thu bất kỳ khoản tiền nào
                  trước khi giải ngân.
                </p>
              
              </div>
              {/* {form định giá xe} */}
              <div className="boxFormValuation w-100-l">
                <form className="w-100-l px-8 py-8 rounded-xl" style={{ backgroundColor: "#fff" }} onSubmit={handleSubmitDinhGiaXe}>
                  <div className="choose-vehicle w-100-l">
                    <div className="w-100-l">
                      <div className="w-50-l">
                        <label>Chọn phương tiện</label>
                      </div>
                      <div className="w-50-l">
                        <input
                          type="radio"
                          id="radio_choose_car"
                          name="radio_choose_car"
                          defaultValue={8}
                          defaultChecked={true}
                        />
                        <label htmlFor="radio_choose_car" className="m-l-10 pl-2">
                          Ô tô
                        </label>
                        <br />
                      </div>
                    </div>
                  </div>
                  <div className="pb-2 w-100-l p-t-10">
                    <div>
                      <label className="w-100-l mb-2">Hãng xe</label>
                    </div>
                    
                    {/* chọn hãng xe */}
                    <select
                      className="w-full border rounded px-3 py-2 loan-option text-black"
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setYears([]); // Reset years khi đổi brand
                      }}
                      required
                    >
                      <option value="">Chọn hãng xe *</option>

                      {brands.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                   </div>

                  {/* chọn năm sản xuất */}
                  <div className="pb-2 w-100-l p-t-10">
                    <label>Năm sản xuất</label>
                  
                    <select
                            className="w-full border rounded px-3 py-2 loan-option text-black"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            disabled={!selectedBrand || years.length === 0}
                            required
                          >
                          <option value="">
                            Chọn năm sản xuất *
                          </option>
                          
                          {years.map((year, index) => (
                            <option key={index} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                  </div>

                  {/* chọn tên xe */}
                  <div className="pb-2 w-100-l p-t-10">
                    <label>Tên xe</label>
                  
                    <select
                            className="w-full border rounded px-3 py-2 loan-option text-black"
                            value={selectedName}
                            disabled={!selectedBrand || years.length === 0 && !selectedYear || names.length === 0}
                            onChange={(e) => {
                              setSelectedNameCar(e.target.value);
                            }}
                            required
                          >
                          <option value="">
                            Chọn tên xe *
                          </option>
                           {names.map((names, index) => (
                            <option key={index} value={names}>
                              {names}
                            </option>
                          ))}
                          
                        </select>
                  </div>
                  


                  <div className="w-100-l p-t-10">
                    {/* <button type="button" onclick="HandlePrice(this, '#_i_loading_valuation')">
                      Định giá xe <i id="_i_loading_valuation" className="" />
                    </button> */}
                    <button type="submit" >
                      Định giá xe <i id="_i_loading_valuation" className="" />
                    </button>
                  </div>
                </form>
              </div>

          </div>

        </div>
      </div>
      <div  style={{width:"100%",float:"left"}}>
        <div className="title font-bold text-center mt-6 mb-4 mx-8" style={{padding:"0 40px"}}>
              <h2 style={{ fontSize: "18px", color: "black" }}>
                Ưu điểm gói vay Tima
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
       <div className="mx-3 mt-3 space-y-3">
        {(!loanModalOpen && !valuationModalOpen) && (
          <button
            onClick={() => {
              setValuationModalOpen(false);
              setLoanModalOpen(true);
            }}
            className="fix-dang-ky-vay fixed-btn w-full text-white font-bold  my-2 py-2 rounded"
          >
            Đăng ký vay
          </button>
        )}
          
        </div>
        


{/* Modal định giá xe */}
{valuationModalOpen && (
  <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="modal-content bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="modal-header flex items-center">
        <h3 className="text-lg font-semibold">KẾT QUẢ ĐỊNH GIÁ XE</h3>
        </div>
        <button
          onClick={() => setValuationModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
      </div>

      <div className="top-modal">
        <div className="flex justify-center">
          <img src={ImgDinhGia} width="60%" />
        </div>
        <div className="text-[20px] font-semibold leading-6 text-center ">
          <label>
            Khoảng giá ước tính <span className="colorTima">tại Tima</span>
          </label>
        </div>
        <div className="text-center text-[14px] mt-2 text-gray`">
          <label>Tổng hợp từ hơn 350.000 nguồn dữ liệu</label>
        </div>
        <div className="result">
          {valuationResult?.data && (
            <div className="mt-4">
              {/* Hiển thị giá nếu có */}
              {valuationResult.data && (
                <p className="text-2xl bg-orange-100 font-bold text-[#EF592E] mt-4 text-center px-2 py-2 rounded-lg">
                    {valuationResult.data} VNĐ
                </p>
              )}
              {/* Hiển thị các thông tin khác từ API nếu có */}
              {/* <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto mt-2">
                <p>Hiện tại chưa có thông tin!</p>
              </pre> */}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
             <strong className="title">Thông tin xe của bạn</strong>
        </div>

      <div className="bottom-modal mt-4 w-100-l px-4 py-4 bg-gray-100 rounded-xl">
   
        <div className="boxInfomationCar">
          <div>
            <label>Hãng xe</label>
            <strong className="w-100-l">{selectedBrand}</strong>
          </div>
          <div className=" py-2 w-100-l">
            <label>Năm sản xuất</label>
            <strong className="w-100-l">{selectedYear}</strong>
          </div>
          <div className="w-100-l">
            <label>Tên xe</label>
            <strong className="w-100-l">{selectedName}</strong>
          </div>
        </div>
        
      </div>
      <div className="m-t-20 w-100-l">
          <button
            onClick={() => {
              setValuationModalOpen(false);
              setLoanModalOpen(true);
            }}
            className="btn btnCarValuationOther w-full bg-tima-orange text-white font-bold  my-2 py-2 rounded"
          >
            Đăng ký vay
          </button>
        </div>
    </div>
  </div>
)}
      {/* ========== MODAL ========== */}
      {loanModalOpen && (
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

            <form onSubmit={handleLoanSubmit}>
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