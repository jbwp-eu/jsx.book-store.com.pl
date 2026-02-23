import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const Meta = ({
  title = "BookStore",
  titlePL = "BookStore-PL",
  description = "A modern ecommerce platform - bookstore",
  descriptionPL = "Nowoczesna platforma e-commerce - księgarnia",
  keywords = "books, książki",
}) => {
  const { i18n } = useTranslation();
  const isPL = i18n.language === "pl";

  return (
    <Helmet>
      <title>{isPL ? titlePL : title}</title>
      <meta
        name="description"
        content={isPL ? descriptionPL : description}
      />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

export default Meta;
