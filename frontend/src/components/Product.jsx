import { Link } from "react-router-dom";
import Image from "./Image";
import Currency from "./Currency";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Product = ({ ...product }) => {
  const { id, title, price, image, countInStock } = product;
  const { currency } = useSelector((state) => state.ui);
  const { t } = useTranslation();

  return (
    <article className="product">
      <Link to={`/product/${id}`} state={{ id }}>
        <Image image={image} title={title} />
      </Link>
      <h2>{title}</h2>
      {Boolean(countInStock) ? (
        <p>
          <Currency currency={currency}>{price.toFixed(2)}</Currency>{" "}
        </p>
      ) : (
        <p className="form-error">
          {t("productDetail.outOfStock")}
        </p>
      )}
    </article>
  );
};

export default Product;
