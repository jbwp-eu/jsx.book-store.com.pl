import { setCredentials } from "../slices/authSlice";
import { uiActions } from '../slices/uiSlice';
import SplitScreen from "../components/SplitScreen";
import UserOrders from "../components/UserOrders";
import UserProfileForm from "../components/UserProfileForm.jsx";
import { redirect } from "react-router-dom";
import i18n from "../i18n";

export const loader = (dispatch, language) => async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/mine?language=${language}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  });

  if (!response.ok) {
    const responseData = await response.json();
    dispatch(
      uiActions.showNotification({
        status: 'error',
        title: i18n.t('common.error'),
        message: responseData.message,
      })
    );
    return redirect("/");
  }
  return response;
}


const ProfilePage = () => {
  return (
    <SplitScreen className='wrapper__profile' flexBasis_1='20%' flexBasis_2='80%' exists={false}>
      <UserOrders />
      <UserProfileForm />
    </SplitScreen >
  );
}
export default ProfilePage;


export const action = (dispatch, language) => async ({ request }) => {

  const data = await request.formData();
  const { method } = await request

  let updatedUserInfo = {
    name: data.get('name'),
    email: data.get('email'),
    password: data.get('password')
  }

  dispatch(
    uiActions.showNotification({
      status: 'pending',
      title: i18n.t('common.sending'),
      message: i18n.t('common.sendingData'),
    })
  );

  const token = localStorage.getItem('token');

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/profile?language=${language}`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(updatedUserInfo)
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
    return redirect("/");
  }

  const resData = await response.json();

  const { id, name, email, isAdmin } = resData;

  dispatch(setCredentials({ id, name, email, isAdmin }));

  dispatch(
    uiActions.showNotification({
      status: 'success',
      title: i18n.t('common.success'),
      message: resData.message,
    }),
  );
  return redirect("/profile");
}