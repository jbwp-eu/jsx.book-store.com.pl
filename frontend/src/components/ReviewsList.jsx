import Rating from "./Rating";
import { useTranslation } from "react-i18next";

const ReviewsList = ({ ...product }) => {
  const { reviews } = product;
  const { t } = useTranslation();

  return (
    <section className='product__detail'>
      <div className="product__detail-reviews">
        <h2>{t('description.reviewsTitle')}</h2>
        {reviews?.length === 0 && <p>{t('description.noReviews')}</p>}
        <ul>
          {reviews?.map(review => (
            <li key={review.id}>
              {review.name}
              <Rating value={review.rating} />
              <p>{review.comment}</p>
              <p>{review.createdAt.substring(0, 10)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ReviewsList;