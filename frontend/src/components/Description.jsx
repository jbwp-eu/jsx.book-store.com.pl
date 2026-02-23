import Rating from "./Rating";
import Currency from "./Currency";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Description = ({ ...product }) => {
  const { title, price, description, rating, numReviews } = product;
  const { currency } = useSelector((state) => state.ui);
  const { t } = useTranslation();

  return (
    <section className="product__detail-description">
      <h1>{title}</h1>
      <Rating
        value={rating}
        text={`${numReviews} ${t("description.reviews", { count: numReviews })}`}
      />
      <p>
        {t("description.price")}{" "}
        <Currency currency={currency}>{price}</Currency>
      </p>
      <p>{`${t("description.description")} ${description}`}</p>
    </section>
  );
};

export default Description;
