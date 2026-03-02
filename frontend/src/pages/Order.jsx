import { useLoaderData, redirect } from "react-router-dom";
import { uiActions } from "../slices/uiSlice";
import SplitScreen from "../components/SplitScreen";
import OrderInformation from "../components/OrderInformation";
import OrderSummary from "../components/OrderSummary";
import Message from "../components/Message";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const loader =
  (dispatch, language) =>
  async ({ params }) => {
    const { id } = params;

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders/${id}?language=${language}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
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
      return redirect("/");
    } else {
      const responseData = await response.json();
      return responseData;
    }
  };

const OrderPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const order = useLoaderData();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    dispatch(setCredentials({ ...userInfo }));
  }, [dispatch]);

  let content;

  if (order) {
    content = (
      <div className="order">
        <h1>
          {t("order.orderId")}
          {order.id}
        </h1>
        <SplitScreen
          className="wrapper__order"
          flexBasis_1="60%"
          flexBasis_2="35%"
          exists={false}
        >
          <div>
            <OrderInformation data={order} order />
          </div>
          <div>
            <OrderSummary data={order} />
          </div>
        </SplitScreen>
      </div>
    );
  } else {
    content = <Message>{t("order.notCreated")}</Message>;
  }
  return <>{content}</>;
};

const action =
  (dispatch, language) =>
  async ({ request, params }) => {
    const { id } = params;

    const { method } = request;

    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: i18n.t("common.sending"),
        message: i18n.t("common.sendingData"),
      }),
    );
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders/${id}/deliver?language=${language}`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
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
      return redirect("/");
    } else {
      const resData = await response.json();

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: i18n.t("common.success"),
          message: resData.message,
        }),
      );
      return redirect(`/admin/ordersList`);
    }
  };

OrderPage.action = action;
OrderPage.loader = loader;

export default OrderPage;
