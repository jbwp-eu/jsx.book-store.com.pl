// import { formatProdErrorMessage } from '@reduxjs/toolkit';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useTranslation } from "react-i18next";

const AuthRegisterForm = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const navigation = useNavigation();

  let initial = { email: "", password: "" };

  let schema = {
    email: string()
      .required(t("auth.pleaseEnterEmail"))
      .email(t("contact.emailMustBeValid")),
    password: string()
      .required(t("auth.pleaseEnterPassword"))
      .min(4, t("auth.minChars")),
  };

  pathname === "/login"
    ? (initial = { ...initial })
    : (initial = { ...initial, name: "" });

  pathname === "/login"
    ? (schema = { ...schema })
    : (schema = { ...schema, name: string().required(t("auth.pleaseEnterName")) });

  const formik = useFormik({
    initialValues: initial,
    validationSchema: object(schema),

    onSubmit: (values) => {
      submit(values, {
        method: "post",
        encType: "application/json",
      });
    },
  });

  const redirect = searchParams.get("redirect") || "/";

  // console.log('redirect:', redirect);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  let authForm = (
    <>
      <p>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder={t("auth.enterEmail")}
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          // required
        />
      </p>
      {formik.touched.email && formik.errors.email ? (
        <p className="form-error">{formik.errors.email}</p>
      ) : null}
      <p>
        <label htmlFor="password">
          {t("auth.password")}
        </label>
        <input
          id="password"
          type="password"
          placeholder={t("auth.enterPassword")}
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          // required
        />
      </p>
      {formik.touched.password && formik.errors.password ? (
        <p className="form-error">{formik.errors.password}</p>
      ) : null}
    </>
  );

  const cancelHandler = () => {
    navigate("..");
  };

  const isSubmitting = navigation.state === "submitting";

  return (
    <form onSubmit={formik.handleSubmit}>
      {pathname === "/login" && (
        <>
          <h1>{t("auth.signIn")}</h1>
          {authForm}
          <div className="redirect">
            <p>{t("auth.newCustomer")}</p>
            <Link
              to={
                redirect !== "/"
                  ? `/register?redirect=${redirect}`
                  : "/register"
              }
            >
              {t("auth.register")}
            </Link>
          </div>
        </>
      )}
      {pathname === "/register" && (
        <>
          <h1>{t("auth.signUp")}</h1>
          <p>
            <label htmlFor="name">{t("auth.name")}</label>
            <input
              id="name"
              type="text"
              placeholder={t("auth.enterName")}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // required
            />
          </p>
          {formik.touched.name && formik.errors.name ? (
            <p className="form-error">{formik.errors.name}</p>
          ) : null}
          {authForm}
          <div className="redirect">
            <p>{t("auth.alreadyHaveAccount")}</p>
            <Link
              to={redirect !== "/" ? `/login?redirect=${redirect}` : "/login"}
            >
              {t("auth.login")}
            </Link>
          </div>
        </>
      )}
      <div className="actions">
        <button
          type="button"
          className="button"
          onClick={cancelHandler}
          disabled={isSubmitting}
        >
          {t("auth.cancel")}
        </button>
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("common.submitting")
            : pathname === "/login"
              ? t("auth.signIn")
              : t("auth.signUp")}
        </button>
      </div>
    </form>
  );
};
export default AuthRegisterForm;
