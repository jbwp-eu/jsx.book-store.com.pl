import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { uiActions } from "../slices/uiSlice.js";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Fallback from "./Fallback.jsx";
import Image from "./Image.jsx";
import BtnSlider from "./BtnSlider.jsx";
import Currency from "./Currency.jsx";
import { useSelector } from "react-redux";

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);

  const [slideIndex, setSlideIndex] = useState(1);

  const { currency, language } = useSelector((state) => state.ui);

  // const nextSlide = () => {
  //   if (slideIndex !== products.length) {
  //     setSlideIndex(slideIndex + 1);
  //   } else if (slideIndex === products.length) {
  //     setSlideIndex(1);
  //   }
  // };

  const handleSlide = useCallback(() => {
    if (slideIndex !== products.length) {
      setSlideIndex(slideIndex + 1);
    } else if (slideIndex === products.length) {
      setSlideIndex(1);
    }
  }, [slideIndex, products.length]);

  const prevSlide = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1);
    } else if (slideIndex === 1) {
      setSlideIndex(products.length);
    }
  };

  const moveDash = (index) => {
    setSlideIndex(index);
  };

  useEffect(() => {
    // let timer = setTimeout(nextSlide, 3000);
    let timer = setTimeout(handleSlide, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [handleSlide]);

  useEffect(() => {
    const topProductsLoader = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products/top?language=${language}`
      );
      if (!response.ok) {
        const responseData = await response.json();
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: t("common.error"),
            message: responseData.message,
          })
        );
        return;
      }
      const products = await response.json();
      // setTimeout(() => {
      //   setProducts(products);
      // }, 5000);
      setProducts(products);
    };
    topProductsLoader();
  }, [dispatch, language]);

  return (
    <div className="carousel">
      {products && products.length > 0 ? (
        <div className="carousel__slider">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={
                slideIndex !== index + 1
                  ? "carousel__slider-slide"
                  : "carousel__slider-slide carousel__slider-activeSlide"
              }
            >
              <Link to={`/product/${product.id}`}>
                <Image image={product.image} />
              </Link>
            </div>
          ))}

          {/* <BtnSlider direction="next" moveSlide={nextSlide} /> */}
          <BtnSlider direction="next" moveSlide={handleSlide} />
          <BtnSlider moveSlide={prevSlide} />

          {products.map((product, index) => (
            <div
              key={product.id}
              className={
                slideIndex !== index + 1
                  ? "carousel__slider-title"
                  : "carousel__slider-title carousel__slider-activeTitle"
              }
            >
              <h1>{product.title}</h1>
              <h2>
                (
                <Currency currency={currency}>
                  {product.price.toFixed(2)}{" "}
                </Currency>{" "}
                )
              </h2>
            </div>
          ))}

          <ul className="carousel__slider-dashesContainer">
            {Array.from({ length: products.length }).map((item, index) => (
              <li
                key={index}
                className={
                  slideIndex !== index + 1
                    ? "carousel__slider-dash"
                    : "carousel__slider-dash carousel__slider-dash-active"
                }
                onClick={() => moveDash(index + 1)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <Fallback />
      )}
    </div>
  );
};

export default ProductCarousel;
