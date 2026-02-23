import { useNavigate, useLoaderData, redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../slices/cartSlice";
import { uiActions } from "../slices/uiSlice.js";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AppContext } from "../components/AppProvider.jsx";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

import ReviewForm from "../components/ReviewForm";
import PriceAndQuantity from "../components/PriceAndQuantity";
import ReviewsList from "../components/ReviewsList";
import Description from "../components/Description";
import Picture from "../components/Picture";
import Message from "../components/Message.jsx";
import SplitScreen from "../components/SplitScreen";

export const loader =
  (dispatch, language) =>
  async ({ request, params }) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/products/${params.id}?language=${language}`
    );

    if (!response.ok) {
      const responseData = await response.json();
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: i18n.t("common.error"),
          message: responseData.message,
        })
      );
      return redirect("/");
    } else {
      return response;
    }
  };

const ProductDetailPage = () => {
  const { isDesktopScreen, isTabletScreen } = useContext(AppContext);
  const { t } = useTranslation();

  const product = useLoaderData();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const addToCartHandler = (qty) => {
    dispatch(addItemToCart({ ...product, qty }));
    navigate("/cart");
  };

  const onClickHandler = () => {
    navigate("..");
  };

  let content;

  if (!product) {
    content = (
      <article className="product-detail product-detail--unavailable">
        <Message>{t("productDetail.unavailable")}</Message>
      </article>
    );
  } else {
    content = (
      <article className="product-detail">
        <button
          type="button"
          className="button button__animation-from-left product-detail__back"
          onClick={onClickHandler}
          aria-label={t("productDetail.goBack")}
        >
          <span aria-hidden>←</span>
          {t("productDetail.goBack")}
        </button>
        <SplitScreen
          className="wrapper__product"
          flexBasis_1={isDesktopScreen ? "30%" : isTabletScreen ? "30%" : "45%"}
          flexBasis_2={isDesktopScreen ? "60%" : isTabletScreen ? "60%" : "45%"}
          flexBasis_3="0%"
          exists={false}
        >
          <div className="wrapper__product-first">
            <Picture {...product} />
            <ReviewForm id={product.id} />
          </div>
          <div className="wrapper__product-second">
            <div className="product-detail__info">
              <Description {...product} />
              <ReviewsList {...product} />
            </div>
            <PriceAndQuantity
              product={product}
              onAddToCartHandler={addToCartHandler}
            />
          </div>
        </SplitScreen>
      </article>
    );
  }
  return <>{content}</>;
};

export default ProductDetailPage;
