import { Form, Link } from 'react-router-dom';
import { uiActions } from "../slices/uiSlice";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from "../i18n";
import Message from "./Message";

const ReviewForm = ({ id }) => {
  const { userInfo } = useSelector(state => state.auth);
  const { t } = useTranslation();

  return (
    <section className='product__detail-form'>
      <h2 >{t('reviewForm.writeReview')}</h2>
      {userInfo ?
        <Form method='post' >
          <label>
            {t('reviewForm.rating')}
            <select name="rate" type="text">
              <option value=''>{t('reviewForm.select')}</option>
              <option value='1'>{t('reviewForm.poor')}</option>
              <option value='2'>{t('reviewForm.fair')}</option>
              <option value='3'>{t('reviewForm.good')}</option>
              <option value='4'>{t('reviewForm.veryGood')}</option>
              <option value='5'>{t('reviewForm.excellent')}</option>
            </select >
          </label>
          <label>
            {t('reviewForm.comment')}
            <textarea row='4' name='comment'></textarea>
          </label>
          <button className='button' type='submit'>
            {t('reviewForm.submit')}
          </button>
        </Form> : <Message>{t('reviewForm.pleaseSignIn')} <Link to={`/login?redirect=/product/${id}`}>{t('reviewForm.signIn')}</Link>{t('reviewForm.toWriteReview')}</Message>}
    </section>);
}

export default ReviewForm;



export const action = (dispatch, language) => async ({ request, params }) => {

  const method = request.method;

  const data = await request.formData();

  const { id } = params;

  const productReview = {
    rate: data.get("rate"),
    comment: data.get("comment")
  }

  dispatch(
    uiActions.showNotification({
      status: 'pending',
      title: i18n.t('common.sending'),
      message: i18n.t('common.sendingDataShort'),
    })
  );

  const token = localStorage.getItem('token');

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products/${id}/reviews?language=${language}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(productReview)
  })
  if (!response.ok) {
    const responseData = await response.json();
    dispatch(
      uiActions.showNotification({
        status: 'error',
        title: i18n.t('common.error'),
        message: responseData.message,
      }),
    );
    return;
  } else {
    const resData = await response.json();
    dispatch(
      uiActions.showNotification({
        status: 'success',
        title: i18n.t('common.success'),
        message: resData.message,
      })
    );
    return resData;
  }
}