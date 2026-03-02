import { useContext } from "react";
import { AppContext } from "../../components/AppProvider";
import { uiActions } from "../../slices/uiSlice";
import { useLoaderData, Link, useSubmit, redirect } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Message from "../../components/Message";

import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const loader = (dispatch, language) => async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/users?language=${language}`,
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
  }
  return response;
};

const UsersListPage = () => {
  const { isDesktopScreen } = useContext(AppContext);
  const { t } = useTranslation();

  let submit = useSubmit();

  let users = useLoaderData();

  const deleteUserHandler = (id) => {
    if (window.confirm(t("common.areYouSure"))) {
      submit({ id }, { method: "delete", encType: "application/json" });
    }
  };

  return (
    <div className="users">
      <h1>{t("admin.users")}</h1>
      {users && users.length > 0 ? (
        <div className="users__list">
          {isDesktopScreen && (
            <table>
              <thead>
                <tr>
                  <th>{t("admin.id")}</th>
                  <th>{t("admin.name")}</th>
                  <th>EMAIL</th>
                  <th>{t("admin.admin")}</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>
                      {user.isAdmin ? (
                        <FaCheck className="icon--success" />
                      ) : (
                        <FaTimes className="icon--danger" />
                      )}
                    </td>
                    <td></td>
                    <td>
                      <Link to={`/admin/user/${user.id}/edit`}>
                        <button className="button">
                          <FaEdit />
                        </button>
                      </Link>
                    </td>
                    <td>
                      <button
                        className="button"
                        onClick={() => deleteUserHandler(user.id)}
                      >
                        <FaTrash className="icon--light" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isDesktopScreen &&
            users?.map((user) => (
              <div key={user.id}>
                <table>
                  <tbody>
                    <tr>
                      <th>{t("admin.id")}</th>
                      <td>{user.id}</td>
                    </tr>
                    <tr>
                      <th>{t("admin.name")}</th>
                      <td>{user.name}</td>
                    </tr>
                    <tr>
                      <th>EMAIL</th>
                      <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <th>{t("admin.admin")}</th>
                      <td>
                        {user.isAdmin ? (
                          <FaCheck className="icon--success" />
                        ) : (
                          <FaTimes className="icon--danger" />
                        )}
                      </td>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                  </tbody>
                </table>
                <div className="users__list-buttons">
                  <Link to={`/admin/user/${user.id}/edit`}>
                    <button className="button">
                      <FaEdit />
                    </button>
                  </Link>
                  <button
                    className="button"
                    onClick={() => deleteUserHandler(user.id)}
                  >
                    <FaTrash className="icon--light" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <Message>{t("admin.noUsers")}</Message>
      )}
    </div>
  );
};

const action =
  (dispatch, language) =>
  async ({ request }) => {
    const { method } = await request;
    const { id } = await request.json();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/${id}?language=${language}`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Baerer " + token,
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
      return;
    }
    const resData = await response.json();

    dispatch(
      uiActions.showNotification({
        status: "success",
        title: i18n.t("common.success"),
        message: resData.message,
      }),
    );
  };

UsersListPage.loader = loader;
UsersListPage.action = action;
export default UsersListPage;
