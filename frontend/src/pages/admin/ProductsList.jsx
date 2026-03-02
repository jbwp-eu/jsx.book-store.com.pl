import { useSubmit, Link, useLoaderData, redirect } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { AppContext } from "../../components/AppProvider";
import { useContext } from "react";
import { uiActions } from "../../slices/uiSlice";
import Message from "../../components/Message";
import Pagination from "../../components/Pagination";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const loader =
  (dispatch, language) =>
  async ({ params }) => {
    const { pageNumber, keyword } = params;

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/products?keyword=${keyword}&pageNumber=${pageNumber}&language=${language}`,
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
      return response;
    }
  };

const ProductsListPage = () => {
  const { isDesktopScreen } = useContext(AppContext);
  const { t } = useTranslation();

  const data = useLoaderData();

  const { products, pages } = data;

  const submit = useSubmit();

  const deleteHandler = (id) => {
    const proceed = window.confirm(t("admin.areYouSureProduct"));

    if (proceed) {
      let formData = new FormData();
      formData.append("id", id);
      formData.append("intent", "delete");
      submit(formData, {
        method: "delete",
      });
    }
  };

  const createHandler = () => {
    const proceed = window.confirm(t("admin.createProductConfirm"));

    if (proceed) {
      let formData = new FormData();
      formData.append("intent", "create");
      submit(formData, {
        method: "post",
      });
    }
  };

  return (
    <div className="products">
      <h1>{t("admin.products")}</h1>

      {products && products.length > 0 ? (
        <div className="products__list">
          <button className="button" onClick={createHandler}>
            <FaEdit />
            {t("admin.createProduct")}
          </button>

          {isDesktopScreen && (
            <table>
              <thead>
                <tr>
                  <th>{t("admin.id")}</th>
                  <th>{t("admin.title")}</th>
                  <th>{t("admin.category")}</th>
                  <th>{t("admin.price")}</th>
                  <th>{t("admin.stock")}</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((book) => (
                  <tr key={book._id}>
                    <td>{book._id}</td>
                    <td>{book.title}</td>
                    <td>{book.category}</td>
                    <td>{book.price}</td>
                    <td>{book.countInStock}</td>
                    <td>
                      <Link
                        to={`/admin/product/${book._id}/edit`}
                        state={{ pages: pages }}
                      >
                        <button className="button">
                          <FaEdit />
                        </button>
                      </Link>
                    </td>
                    <td>
                      <button
                        className="button"
                        onClick={() => deleteHandler(book._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isDesktopScreen &&
            products.map((book) => (
              <div key={book._id}>
                <table>
                  <tbody>
                    <tr>
                      <th>{t("admin.id")}</th>
                      <td>{book._id}</td>
                    </tr>
                    <tr>
                      <th>{t("admin.title")}</th>
                      <td>{book.title}</td>
                    </tr>
                    <tr>
                      <th>{t("admin.category")}</th>
                      <td>{book.category}</td>
                    </tr>
                    <tr>
                      <th>{t("admin.price")}</th>
                      <td>{book.price}</td>
                    </tr>
                    <tr>
                      <th>{t("admin.stock")}</th>
                      <td>{book.countInStock}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="products__list-buttons">
                  <Link
                    to={`/admin/product/${book._id}/edit`}
                    state={{ pages: pages }}
                  >
                    <button className="button">
                      <FaEdit />
                    </button>
                  </Link>
                  <button
                    className="button"
                    onClick={() => deleteHandler(book._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <Message>{t("admin.noProducts")}</Message>
      )}
      <Pagination pages={pages} isAdmin={true} />
    </div>
  );
};

const action =
  (dispatch, language) =>
  async ({ request }) => {
    const data = await request.formData();

    const { method } = request;

    const intent = data.get("intent");

    const token = localStorage.getItem("token");

    if (intent === "delete") {
      const id = data.get("id");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products/${id}?language=${language}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
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

      return redirect(`/admin/productslist/${resData.pages}`);
    }

    if (intent === "create") {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products?language=${language}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
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

      return redirect(`/admin/productslist/${resData.pages}`);
    }
  };

ProductsListPage.loader = loader;
ProductsListPage.action = action;
export default ProductsListPage;
