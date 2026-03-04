import React, { useState } from "react";
import investMoney from '../pages/images/icon-invest-oto.png';
import investSalary from '../pages/images/icon-invest-luong.png';
import icomMember from '../pages/images/icon-member.png';
import iconMoney from '../pages/images/icon-money.png'; 
import iconCalendar from '../pages/images/icon-calendar.png';
import iconProfit from '../pages/images/icon-profit.png';
import iconRisk from '../pages/images/icon-risk.png';

function Invest() {

  const [openMoney, setOpenMoney] = useState(false);
   const [openSalaryAdvance , setOpensalaryAdvance] = useState(false);

  return (
    <div className="box-invest">
 <div className="box-invest-content w-full flex justify-center items-center gap-2 mt-4 p-2">

        {/* BUTTON */}
        <button onClick={() => {
        setOpenMoney(!openMoney);
        
        setOpensalaryAdvance(false);
        }} className="btn-invest rounded-xl p-2 bg-[#FDBF94] w-1/2  border border-t-0 border-[#e98343d6]"
        >
          <div className="flex items-center">
            <img
              src={investMoney}
              alt="icon"
              className="w-6 h-6 mr-2"
            />
            <div className="text-left">
              <p className="text-sm text-black font-bold">Tài trợ vốn</p>
              <p className="text-xs text-black font-normal">Cho chủ sở hữu ô tô</p>
            </div>
          </div>
        </button>
         <button onClick={() => {
        setOpensalaryAdvance(!openSalaryAdvance);
        setOpenMoney(false);
        
        }} className="rounded-xl p-2 bg-[#FDBF94] w-1/2  border border-t-0 border-[#e98343d6]"
        >
          <div className="flex items-center">
            <img
              src={investSalary}
              alt="icon"
              className="w-6 h-6 mr-2"
            />
            <div className="text-left">
              <p className="text-sm text-black font-bold">Tài trợ ứng lương</p>
              <p className="text-xs text-black font-normal">Cho người lao động</p>
            </div>
          </div>
        </button>
        

       
        

      </div>
       {/* NỘI DUNG XỔ XUỐNG */}
        {openMoney && (
          <div className="w-full  h-full  p-[12px] bg-gray-100 rounded shadow text-left">
            <p className="text-base font-bold mb-2">Lợi nhuận đến 15,5%/năm</p>
            <div className="text-sm flex gap-2 h-full mb-2">
                <img
                    src={icomMember}
                    alt="icon"
                    className="h-full"
                    />
                    <p className="text-sm  text-gray-600">43,628 Nhà đầu tư đã tham gia</p>
            </div>
            <p className="text-sm mb-2">Với sản phẩm "Tài trợ Vốn", Nhà đầu tư được kết nối trực tiếp với khách hàng sở hữu ô tô có nhu cầu vay vốn, giúp tối ưu hiệu quả đầu tư và dòng tiền.</p>
             <div className="text-sm flex gap-2 mt-2 bg-[#ffd0b363] rounded">
                <img
                    src={iconMoney}
                    alt="icon"
                    className="h-full "
                    />
                    <span className="flex font-bold ">Số tiền đầu tư tối thiểu:</span> <p className="text-sm  text-black ">20,000,000 VNĐ</p>
            </div>
            <div className="text-sm flex gap-2 mt-2">
                <img
                    src={iconCalendar}
                    alt="icon"
                    className="h-full "
                    />
                    <span className="flex font-bold ">Kỳ hạn linh hoạt:</span> <p className="text-sm  text-black ">1 – 60 tháng, dễ dàng tái đầu tư.</p>
            </div>
            <div className="text-sm flex gap-2 mt-2 bg-[#ffd0b363] rounded items-center justify-center">
                <img
                    src={iconProfit}
                    alt="icon"
                    className="h-full"
                    />
                    <p className="text-sm  text-black "><span className=" font-bold "> Lợi nhuận hấp dẫn:</span> TIMA kết nối đa dạng nhu cầu vay, giúp nhà đầu tư linh hoạt lựa chọn thời gian đầu tư và tăng tốc hiệu quả sinh lời.</p>
            </div>
            <div className="text-sm flex gap-2 mt-2 items-center justify-center">
                <img
                    src={iconRisk}
                    alt="icon"
                    className="h-full "
                    />
                    <p className="text-sm  text-black "><span className="font-bold "> Quản lý rủi ro minh bạch:</span> Hồ sơ được thẩm định nhiều lớp và minh bạch, giúp nhà đầu tư dễ dàng theo dõi, chủ động quản lý khoản đầu tư 24/7.</p>
            </div>
          </div>
        )}
        {openSalaryAdvance && (
         <div className="w-full  h-full  p-[12px] bg-gray-100 rounded shadow text-left">
            <p className="text-base font-bold mb-2">Tài trợ Ứng Lương - Lợi nhuận lên tới 11%/năm</p>
            <div className="text-sm flex gap-2 h-full mb-2">
                <img
                    src={icomMember}
                    alt="icon"
                    className="h-full"
                    />
                    <p className="text-sm  text-gray-600">22,126 Nhà đầu tư đã tham gia</p>
            </div>
            <p className="text-sm mb-2">Với Sản phẩm "Tài trợ Ứng lương", Nhà đầu tư được kết nối trực tiếp đến Người Lao Động có nhu cầu ứng trước một phần thu nhập dựa trên ngày công đã hình thành nhưng chưa đến kỳ nhận lương</p>
             <div className="text-sm flex gap-2 mt-2 bg-[#ffd0b363] rounded">
                <img
                    src={iconMoney}
                    alt="icon"
                    className="h-full "
                    />
                    <span className="flex font-bold ">Số tiền đầu tư tối thiểu:</span> <p className="text-sm  text-black ">500,000 VNĐ</p>
            </div>
            <div className="text-sm flex gap-2 mt-2">
                <img
                    src={iconCalendar}
                    alt="icon"
                    className="h-full "
                    />
                    <span className="flex font-bold ">Kỳ hạn linh hoạt:</span> <p className="text-sm  text-black ">1 – 45 ngày, dễ dàng tái đầu tư.</p>
            </div>
            <div className="text-sm flex gap-2 mt-2 bg-[#ffd0b363] rounded items-center justify-center">
                <img
                    src={iconProfit}
                    alt="icon"
                    className="h-full"
                    />
                    <p className="text-sm  text-black "> Phù hợp với Nhà đầu tư có nguồn tiền nhàn rỗi, muốn quản lý dòng tiền linh hoạt, an toàn và hiệu quả.</p>
            </div>
           
          </div>
        )}
    </div>
  );
}

export { Invest };