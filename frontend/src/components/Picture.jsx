import Image from "./Image";

const Picture = ({ ...product }) => {
  const { image, title } = product;

  return (
    <section className="product__detail">
      <Image image={image} title={title} className="product__detail-picture" />
    </section>
  );
};

export default Picture;
