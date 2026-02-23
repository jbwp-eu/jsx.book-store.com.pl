import UserEditForm from "../../components/UserEditForm";
import { uiActions } from "../../slices/uiSlice";
import { redirect, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

export const loader = (dispatch, language) => async ({ params }) => {
  const { showNotification } = uiActions;
  const { id } = params;
  const token = localStorage.getItem('token');

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}?language=${language}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  });

  if (!response.ok) {
    const resData = await response.json();
    dispatch(
      showNotification({
        status: 'error',
        title: i18n.t('common.error'),
        message: resData.message,
      })
    )
    return redirect("/");
  }
  return response;
}

const UserEditPage = () => {
  const { t } = useTranslation();
  return (
    <div className="edit-form">
      <button className="button">
        <Link to='/admin/usersList'>{t('admin.goBack')}</Link>
      </button>
      <UserEditForm />
    </div>
  )
}
export default UserEditPage;


export const action = (dispatch, language) => async ({ request, params }) => {

  const { showNotification } = uiActions;

  const { id } = params;

  const { method } = request;

  const formData = await request.formData();

  const name = formData.get('name');

  const email = formData.get('email');

  const isAdmin = formData.get('isAdmin');


  const data = { name, email, isAdmin };

  const token = localStorage.getItem('token');

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}?language=${language}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const resData = await response.json();
    dispatch(
      showNotification({
        status: 'error',
        title: i18n.t('common.error'),
        message: resData.message,
      })
    )
    return redirect("/")
  }
  const resData = await response.json();

  dispatch(
    uiActions.showNotification({
      status: 'success',
      title: i18n.t('common.success'),
      message: resData.message,
    }),
  );
  return redirect('/admin/usersList');
}