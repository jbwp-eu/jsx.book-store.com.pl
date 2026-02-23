import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CartItem from "../components/CartItem.jsx";
import SplitScreen from "../components/SplitScreen.jsx";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message.jsx";
import Currency from "../components/Currency.jsx";

const CartPage = () => {
  const { cartItems, itemsQuantity, itemsPrice } = useSelector(
    (state) => state.cart
  );

  const { currency } = useSelector((state) => state.ui);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <SplitScreen
      className="wrapper__cart"
      flexBasis_1="60%"
      flexBasis_2="40%"
      exists={false}
    >
      <div className="cart__group">
        <h1>{t("cart.title")}</h1>
        {cartItems?.length === 0 ? (
          <Message>
            {t("cart.empty")}{" "}
            <Link to="..">{t("cart.goBack")}</Link>
          </Message>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </ul>
        )}
      </div>

      <div className="cart__summary">
        <h1>
          {t("cart.subtotal")} ({itemsQuantity}) {t("cart.items")}
        </h1>
        <h2>
          <Currency currency={currency}>{itemsPrice} </Currency>
        </h2>

        <button
          className="button"
          disabled={cartItems.length === 0}
          onClick={checkoutHandler}
        >
          {t("cart.proceedToCheckout")}
        </button>
      </div>
    </SplitScreen>
  );
};

export default CartPage;
