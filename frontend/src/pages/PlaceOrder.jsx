import { useEffect } from "react";
import OrderInformation from "../components/OrderInformation";
import PlaceOrderSummary from "../components/PlaceOrderSummary";
import SplitScreen from "../components/SplitScreen";
import { useSelector } from "react-redux";
import { useNavigate, redirect } from "react-router-dom";
import { uiActions } from "../slices/uiSlice";
import { clearCartItems } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import i18n from "../i18n";

const PlaceOrderPage = () => {
  const cart = useSelector((state) => state.cart);

  const { shippingAddress, paymentMethod } = cart;

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postal_code ||
      !shippingAddress.country
    ) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress, paymentMethod, navigate]);

  return (
    <div className="place-order">
      <CheckoutSteps step1 step2 step3 step4 />
      <SplitScreen
        className="wrapper__order"
        flexBasis_1="60%"
        flexBasis_2="35%"
        exists={false}
      >
        <div>
          <OrderInformation data={cart} cart />
        </div>
        <div>
          <PlaceOrderSummary />
        </div>
      </SplitScreen>
    </div>
  );
};

const action =
  (dispatch, language) =>
  async ({ request }) => {
    let { method } = await request;

    let data = await request.json();

    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: i18n.t("common.sending"),
        message: i18n.t("common.sendingData"),
      }),
    );

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders?language=${language}`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const responseData = await response.json();
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: i18n.t("common.error"),
          message: responseData.message,
        }),
      );
      return;
    }
    const { createdOrder, message } = await response.json();

    dispatch(clearCartItems());

    dispatch(
      uiActions.showNotification({
        status: "success",
        title: i18n.t("common.success"),
        message: message,
      }),
    );
    return redirect(`/order/${createdOrder.id}/checkout`);
  };

PlaceOrderPage.action = action;
export default PlaceOrderPage;
