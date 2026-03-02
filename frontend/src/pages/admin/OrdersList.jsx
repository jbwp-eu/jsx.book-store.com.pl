import { useContext } from "react";
import { useLoaderData, Link, useSubmit, redirect } from "react-router-dom";
import { AppContext } from "../../components/AppProvider";
import { FaTrash } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { uiActions } from "../../slices/uiSlice";
import Message from "../../components/Message";
import { useSelector } from "react-redux";
import Currency from "../../components/Currency";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const loader = (dispatch, language) => async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/orders?language=${language}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Baerer " + token,
      },
    },
  );
  if (!response.ok) {
    const resData = await response.json();
    dispatch(
      uiActions.showNotification({
        status: "error",
        title: i18n.t("common.error"),
        message: resData.message,
      }),
    );
    return redirect("/");
  }
  return response;
};

const OrdersListPage = () => {
  const { currency } = useSelector((state) => state.ui);
  const { t } = useTranslation();

  const { isDesktopScreen } = useContext(AppContext);

  const submit = useSubmit();

  const orders = useLoaderData();

  const deleteOrderHandler = (id) => {
    const proceed = window.confirm(t("common.areYouSure"));

    if (proceed) {
      submit(
        { id },
        {
          method: "delete",
          encType: "application/json",
        },
      );
    }
  };

  return (
    <div className="orders">
      <h1>{t("admin.ordersList")}</h1>
      {orders && orders.length > 0 ? (
        <div className="orders__list">
          {isDesktopScreen && (
            <table>
              <thead>
                <tr>
                  <th>{t("admin.id")}</th>
                  <th>{t("admin.user")}</th>
                  <th>{t("admin.date")}</th>
                  <th>{t("admin.total")}</th>
                  <th>{t("admin.paid")}</th>
                  <th>{t("admin.delivered")}</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>{order.createdAt.substring(0, 19)}</td>
                    <td>
                      <Currency currency={currency}>
                        {order.totalPrice}
                      </Currency>
                    </td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt?.substring(0, 19)
                      ) : (
                        <FaTimes className="icon--danger" />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 11)
                      ) : (
                        <FaTimes className="icon--danger" />
                      )}
                    </td>
                    <td>
                      <Link to={`/order/${order.id}`}>
                        <button className="button">
                          {t("common.details")}
                        </button>
                      </Link>
                    </td>
                    <td>
                      <button
                        className="button"
                        onClick={() => deleteOrderHandler(order.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                    <td>
                      {order.stripeIntent && (
                        <Link
                          to={`https://dashboard.stripe.com/payments/${order.stripeIntent}`}
                        >
                          <button className="button">
                            {t("admin.stripeDetails")}
                          </button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isDesktopScreen &&
            orders.map((order) => (
              <div key={order._id}>
                <table>
                  <tbody>
                    <tr>
                      <th>{t("admin.id")}</th>
                      <td>{order.id}</td>
                    </tr>
                    <tr>
                      <th>{t("admin.user")}</th>
                      <td>{order.user && order.user.name}</td>
                    </tr>
                    <tr>
                      <th>{t("admin.date")}</th>
                      <td>{order.createdAt.substring(0, 19)}</td>
                    </tr>
                    <tr>
                      <th>{t("admin.total")}</th>
                      <td>
                        <Currency currency={currency}>
                          {order.totalPrice}
                        </Currency>
                      </td>
                    </tr>
                    <tr>
                      <th>{t("admin.paid")}</th>
                      <td>
                        {order.isPaid ? (
                          order?.paidAt.substring(0, 19)
                        ) : (
                          <FaTimes className="icon--danger" />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("admin.delivered")}</th>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 19)
                        ) : (
                          <FaTimes className="icon--danger" />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="orders__list-buttons">
                  <Link to={`/order/${order.id}`}>
                    <button className="button">{t("common.details")}</button>
                  </Link>
                  <button
                    className="button"
                    onClick={() => deleteOrderHandler(order.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <Message>{t("admin.noOrders")}</Message>
      )}
    </div>
  );
};

const action =
  (dispatch, language) =>
  async ({ request }) => {
    const { method } = request;

    const { id } = await request.json();

    const token = localStorage.getItem("token");

    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: i18n.t("common.sending"),
        message: i18n.t("common.sendingData"),
      }),
    );

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders/${id}?language=${language}`,
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
      return redirect("/admin/ordersList");
    }
    const responseData = await response.json();
    dispatch(
      uiActions.showNotification({
        status: "success",
        title: i18n.t("common.success"),
        message: responseData.message,
      }),
    );
    return redirect("/admin/ordersList");
  };

OrdersListPage.loader = loader;
OrdersListPage.action = action;
export default OrdersListPage;
