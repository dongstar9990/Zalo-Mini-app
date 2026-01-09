import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import duyetVayNhanh from "../pages/images/duyet-vay-nhanh.png";
import baoMatThongTin from "../pages/images/bao-mat-thong-tin.png";
import hanMucVayLon from "../pages/images/han-muc-vay-lon.png";
import thuTucToiGian from "../pages/images/thu-tuc-toi-gian.png";

const imgHome = [
  {
    src: duyetVayNhanh,
    detail: "Lãi suất từ ",
    title: "13%/NĂM"
  },
  {
    src: baoMatThongTin,
    detail: "Hạn mức đến",
    title: "2 TỶ "
  },
  {
    src: hanMucVayLon,
    detail: "Trả góp đến",
    title: "36 THÁNG "
  },

];



function TextSlider() {
    var settings = {
        dots: false,
        infinite: true,
        speed: 1800,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",

    };

    return (
        <div > {/* Thêm container với overflow hidden */}
            <Slider {...settings}>
            {imgHome.map((img, indexheader) => (
                <div key={indexheader} className="flex justify-center">
                <div className="flex flex-col items-center mt-4 pb-4">
                    
                    {/* IMAGE */}
                    <img
                    src={img.src}
                    alt="Image"
                    className="w-1/2 object-cover rounded-full border-[5px] border-[#e7e3e3]"
                    />

                    {/* TEXT */}
                    <p className="mt-3 text-center ">
                    {img.detail}<strong className="colorTima font-bold "> {img.title}</strong>
                    </p>

                </div>
                </div>
            ))}
            </Slider>

        </div>
    );
}


export { TextSlider };