import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import duyetVayNhanh from "../pages/images/img-banner-1.png";
import baoMatThongTin from "../pages/images/img-banner-2.png";


const imgHome = [
  {
    src: duyetVayNhanh,
  },
  {
    src: baoMatThongTin,
  },
];



function TextSlider() {
    var settings = {
        dots: false,
        infinite: true,
        speed: 1800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",

    };

    return (
        <div > {/* Thêm container với overflow hidden */}
            <Slider {...settings}>
            {imgHome.map((img, indexheader) => (
                <div key={indexheader} className="flex justify-center">
                    <div className="flex flex-col items-center pb-4   ">
                        
                        {/* IMAGE */}
                        <img
                        src={img.src}
                        alt="Image"
                        className="w-full h-full object-cover"
                        />

                        {/* TEXT */}
                        {/* <p className="mt-3 text-center ">
                        {img.detail}<strong className="colorTima font-bold "> {img.title}</strong>
                        </p> */}

                    </div>
                </div>
            ))}
            </Slider>

        </div>
    );
}


export { TextSlider };