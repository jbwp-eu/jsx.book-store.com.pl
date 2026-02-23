import { AppContext } from "../components/AppProvider";
import { useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Currency from "./Currency";
import { useLoaderData } from "react-router-dom";
import Message from "./Message";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const UserOrders = () => {
  const { isDesktopScreen, isTabletScreen } = useContext(AppContext);
  const { currency } = useSelector((state) => state.ui);
  const { t } = useTranslation();

  const orders = useLoaderData();

  return (
    <div className="profile">
      <h1>{t("userOrders.title")}</h1>
      {orders && orders.length > 0 ? (
        <div className="profile__orders">
          {isDesktopScreen && (
            <table>
              <thead>
                <tr>
                  <th>{t("userOrders.id")}</th>
                  <th>{t("userOrders.date")}</th>
                  <th>{t("userOrders.total")}</th>
                  <th>{t("userOrders.paid")}</th>
                  <th>{t("userOrders.delivered")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="table-cell--wrap">
                      {order.id}
                    </td>
                    <td>{order.createdAt.substring(0, 19)}</td>
                    <td>
                      <Currency currency={currency}>
                        {order.totalPrice}
                      </Currency>
                    </td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 19)
                      ) : (
                        <FaTimes className="icon--danger" />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(!isDesktopScreen || isTabletScreen) &&
            orders.map((order) => (
              <table key={order.id}>
                <tbody>
                  <tr>
                    <th>{t("userOrders.id")}</th>
                    <td>{order.id}</td>
                  </tr>
                  <tr>
                    <th>{t("userOrders.date")}</th>
                    <td>{order.createdAt.substring(0, 19)}</td>
                  </tr>
                  <tr>
                    <th>{t("userOrders.total")}</th>
                    <td>
                      <Currency currency={currency}>
                        {order.totalPrice}
                      </Currency>
                    </td>
                  </tr>
                  <tr>
                    <th>{t("userOrders.paid")}</th>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 19)
                      ) : (
                        <FaTimes className="icon--danger" />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("userOrders.delivered")}</th>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes className="icon--danger" />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
        </div>
      ) : (
        <Message>{t("userOrders.noOrders")}</Message>
      )}
    </div>
  );
};

export default UserOrders;
