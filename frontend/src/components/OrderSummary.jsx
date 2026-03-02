import { useSelector } from "react-redux";
import { useSubmit, useNavigate } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { uiActions } from "../slices/uiSlice.js";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Fallback from "./Fallback.jsx";
import Currency from "./Currency.jsx";
import StripePayment from "./StripePayment.jsx";

const OrderSummary = ({ data }) => {
  const [clientSecret, setClientSecret] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { language, currency } = useSelector((state) => state.ui);

  // const { userInfo } = useSelector((state) => state.auth);

  const userInfoStr = localStorage.getItem("userInfo");
  const userInfoObj = userInfoStr ? JSON.parse(userInfoStr) : null;
  const isAdmin = userInfoObj?.isAdmin ?? false;

  const {
    itemsPrice,
    shippingPrice,
    // taxPrice,
    totalPrice,
    isPaid,
    isDelivered,
    paymentMethod,
    id,
  } = data;

  const [clientId, setClientId] = useState();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  let submit = useSubmit();

  /* Stripe */
  useEffect(() => {
    async function getClientSecret() {
      try {
        const amount = Math.round(Number(totalPrice) * 100);
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/create-payment-intent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, id }),
          },
        );
        if (!response.ok) {
          const responseData = await response.json();
          dispatch(
            uiActions.showNotification({
              status: "error",
              title: t("common.error"),
              message: responseData?.message || t("common.errorOccurred"),
            }),
          );
          setIsLoading(false);
          return;
        }
        const { clientSecret } = await response.json();

        setClientSecret(clientSecret);

        setIsLoading(false);
      } catch (err) {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: t("common.error"),
            message: err?.message || t("common.errorOccurred"),
          }),
        );
        setIsLoading(false);
      }
    }

    if (paymentMethod === "Stripe" && !isPaid) {
      getClientSecret();
    }
  }, [
    language,
    id,
    isPaid,
    paymentMethod,
    totalPrice,
    userInfoStr,
    t,
    dispatch,
  ]);

  /* PayPal */
  useEffect(() => {
    async function clientIdLoader() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/config/paypal`,
        );
        if (!response.ok) {
          dispatch(
            uiActions.showNotification({
              status: "error",
              title: t("common.error"),
              message: t("common.authError"),
            }),
          );
          return navigate("/");
        }
        const data = await response.json();

        setClientId(data.clientId);
      } catch (err) {
        console.log(err);
      }
    }

    if (paymentMethod === "PayPal" && !isPaid) {
      clientIdLoader();
    }
  }, [dispatch, language, navigate, isPaid, paymentMethod, t]);

  useEffect(() => {
    if (clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: currency,
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (data && !data.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [data, clientId, paypalDispatch, currency]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch(
          uiActions.showNotification({
            status: "pending",
            title: t("common.sending"),
            message: t("common.sendingData"),
          }),
        );

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/orders/${id}/pay?language=${language}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ ...details }),
          },
        );

        if (!response.ok) {
          const responseData = await response.json();
          dispatch(
            uiActions.showNotification({
              status: "error",
              title: t("common.error"),
              message: responseData.message,
            }),
          );
          return navigate(`/order/${id}`);
        }
        const responseData = await response.json();
        dispatch(
          uiActions.showNotification({
            status: "success",
            title: t("common.success"),
            message: responseData.message,
          }),
        );

        return navigate(`/order/${id}`);
      } catch (err) {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: t("common.error"),
            message: err?.message || t("common.errorOccurred"),
          }),
        );
      }
    });
  }

  function onError(err) {
    dispatch(
      uiActions.showNotification({
        status: "error",
        title: t("common.error"),
        message: err.message,
      }),
    );
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverOrderHandler = () => {
    submit(null, { method: "put" });
  };

  return (
    <div className="order__summary">
      <h1>{t("orderSummary.title")}</h1>
      <div className="order__summary-positions">
        <p>
          {t("orderSummary.items")}{" "}
          <Currency currency={currency}>{itemsPrice}</Currency>
        </p>
        <p>
          {t("orderSummary.shipping")}
          <Currency currency={currency}>{shippingPrice}</Currency>
        </p>
        <p>
          {t("orderSummary.total")}{" "}
          <Currency currency={currency} className="currency__bold">
            {totalPrice}
          </Currency>
        </p>
      </div>
      {isAdmin && isPaid && !isDelivered && (
        <div className="order__summary-button" onClick={deliverOrderHandler}>
          <button className="button">{t("common.markAsDelivered")}</button>
        </div>
      )}
      {/* PayPal Payment */}
      {!isPaid && paymentMethod === "PayPal" && (
        <div className="order__summary-paypal">
          {isPending ? (
            <Fallback />
          ) : (
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            ></PayPalButtons>
          )}
        </div>
      )}
      {/* Stripe Payment */}
      {!isPaid && paymentMethod === "Stripe" && (
        <div className="order__summary-stripe">
          {isLoading ? (
            <Fallback />
          ) : (
            <StripePayment clientSecret={clientSecret} />
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
