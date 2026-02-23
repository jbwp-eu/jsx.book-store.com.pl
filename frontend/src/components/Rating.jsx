import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";

const Rating = ({ value, text }) => {
  return (
    <div className="product__detail-rating">
      <span>
        {value >= 1 ? <FaStar /> : value >= 0.5 ? <FaStarHalf /> : <FaRegStar />}
      </span>
      <span>
        {value >= 2 ? <FaStar /> : value >= 1.5 ? <FaStarHalf /> : <FaRegStar />}
      </span>
      <span>
        {value >= 3 ? <FaStar /> : value >= 2.5 ? <FaStarHalf /> : <FaRegStar />}
      </span>
      <span>
        {value >= 4 ? <FaStar /> : value >= 3.5 ? <FaStarHalf /> : <FaRegStar />}
      </span>
      <span>
        {value >= 5 ? <FaStar /> : value >= 4.5 ? <FaStarHalf /> : <FaRegStar />}
      </span>
      <p>{text}</p>
    </div >
  );
}
export default Rating;