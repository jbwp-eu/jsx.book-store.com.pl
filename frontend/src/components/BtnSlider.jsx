
import { BsChevronLeft } from "react-icons/bs";
import { BsChevronRight } from "react-icons/bs";

const BtnSlider = ({ direction, moveSlide }) => {
  return (
    <span
      className={direction === "next" ? "carousel__slider-next" : "carousel__slider-prev"}
      onClick={moveSlide}
    >
      {direction === "next" ? <BsChevronRight /> : <BsChevronLeft />}
    </span>
  );
}

export default BtnSlider;