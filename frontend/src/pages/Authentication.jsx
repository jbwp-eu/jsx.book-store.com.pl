import { setCredentials } from "../slices/authSlice";
import { uiActions } from "../slices/uiSlice";
import i18n from "../i18n";
import AuthRegisterForm from "../components/AuthRegisterForm";

const AuthenticationPage = () => <AuthRegisterForm />;

export default AuthenticationPage;

export const action =
  (dispatch, language) =>
  async ({ request }) => {
    const data = await request.json();

    let mode = window.location.pathname;

    let authData;

    if (mode === "/login") {
      authData = {
        email: data.email,
        password: data.password,
      };
    } else {
      authData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
    }

    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: i18n.t("common.sending"),
        message: i18n.t("common.sendingData"),
      })
    );

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users${mode}?language=${language}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      }
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
      return;
    }

    const resData = await response.json();

    const { id, name, email, isAdmin, token, message } = resData;

    localStorage.setItem("token", token);

    dispatch(setCredentials({ id, name, email, isAdmin }));

    const expiration = new Date();

    expiration.setMinutes(expiration.getMinutes() + 60);

    localStorage.setItem("expiration", expiration.toString());

    dispatch(
      uiActions.showNotification({
        status: "success",
        title: i18n.t("common.success"),
        message: message,
      })
    );
  };
