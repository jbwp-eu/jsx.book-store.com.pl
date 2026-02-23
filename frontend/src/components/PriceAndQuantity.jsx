import { useState } from "react";
import Currency from "./Currency";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PriceAndQuantity = ({ product, onAddToCartHandler }) => {
  const [qty, setQty] = useState(1);
  const { price, countInStock } = product;
  const { currency } = useSelector((state) => state.ui);
  const { t } = useTranslation();

  return (
    <section className="product__detail">
      <div className="product__detail-quantity">
        <p>
          {t("description.price")}{" "}
          <Currency currency={currency}>{price}</Currency>{" "}
        </p>
        <p>
          {t("productDetail.status")}
          <span>
            {countInStock > 0 ? t("productDetail.inStock") : t("productDetail.outOfStock")}
          </span>
        </p>
        <div>
          <label>
            {t("productDetail.quantity")}
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              <option>{0}</option>
              {[...Array(countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          disabled={countInStock === 0 || qty === 0}
          className="button"
          onClick={() => onAddToCartHandler(qty)}
        >
          {t("productDetail.addToCart")}
        </button>
      </div>
    </section>
  );
};

export default PriceAndQuantity;
