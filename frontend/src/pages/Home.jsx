import { useLoaderData, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Message from "../components/Message";
import Pagination from "../components/Pagination";
import ProductCarousel from "../components/ProductCarousel";
import Product from "../components/Product";
import Meta from "../components/Meta";
import { Home } from "lucide-react";

const loader =
  (dispatch, language) =>
  async ({ params }) => {
    const { pageNumber, keyword } = params;

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/products?keyword=${keyword}&pageNumber=${pageNumber}&language=${language}`,
    );

    if (!response.ok) {
      const resData = await response.json();
      throw new Error(resData.message);
    } else {
      return response;
    }
  };

const HomePage = () => {
  const { keyword } = useParams();
  const { t } = useTranslation();

  const data = useLoaderData();

  if (!data) {
    return;
  }
  const { products = [], pages } = data;

  let content;

  if (!products || products.length === 0) {
    content = <Message>{t("home.noProducts")}</Message>;
  } else {
    content = (
      <div className="products">
        <h1>{t("home.books")}</h1>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Product {...product} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className="home">
      <ProductCarousel />
      <Meta />
      {content}
      <Pagination pages={pages} keyword={keyword ? keyword : ""} />
    </div>
  );
};

HomePage.loader = loader;
export default HomePage;
