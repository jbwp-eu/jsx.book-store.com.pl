import { useSelector } from "react-redux";
import { useSubmit } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Currency from "./Currency";

const PlaceOrderSummary = () => {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    shippingAddress,
    paymentMethod,
    taxPrice,
    totalPrice,
  } = useSelector((state) => state.cart);

  const { currency } = useSelector((state) => state.ui);
  const { t } = useTranslation();

  let submit = useSubmit();

  let jsonData = {
    orderItems: cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };

  const onClickHandler = () => {
    submit(jsonData, { method: "post", encType: "application/json" });
  };

  return (
    <div className="order__summary">
      <h1>{t("orderSummary.title")}</h1>
      <div className="order__summary-items">
        {t("orderSummary.items")}
        <Currency currency={currency}>{itemsPrice}</Currency>
      </div>
      <div className="order__summary-shipping">
        <p>
          {t("orderSummary.shipping")}
          <Currency currency={currency}>{shippingPrice}</Currency>
        </p>
      </div>
      <div className="order__summary-total">
        <h2>
          {t("orderSummary.total")}
          <Currency currency={currency}>{totalPrice}</Currency>
        </h2>
      </div>
      <button
        onClick={onClickHandler}
        disabled={cartItems.length === 0}
        className="button"
      >
        {t("orderSummary.placeOrder")}
      </button>
    </div>
  );
};

export default PlaceOrderSummary;
