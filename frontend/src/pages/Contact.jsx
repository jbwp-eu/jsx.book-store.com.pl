import { useFetcher } from "react-router-dom";
import { uiActions } from "../slices/uiSlice";
import GoogleMap from "../components/GoogleMap";
import { useState } from "react";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const ContactPage = ({ onClose }) => {
  const { t } = useTranslation();

  const [showMap, setShowMap] = useState(false);

  const fetcher = useFetcher();

  let formData = new FormData();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      information: "",
    },

    validationSchema: object({
      firstName: string().required(t("contact.pleaseEnterFirstName")),
      lastName: string(),
      email: string()
        .required(t("contact.pleaseEnterEmailAddress"))
        .email(t("contact.emailMustBeValid")),
      information: string()
        .required(t("contact.pleaseEnterInformation"))
        .min(4, t("contact.minCharacters")),
    }),

    onSubmit: (values) => {
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("information", values.information);

      fetcher.submit(formData, {
        method: "post",
      });

      formik.handleReset();

      onClose(false);

      window.scrollTo(0, 0);
    },
  });

  return (
    <>
      <Modal onClose={() => setShowMap(false)} show={showMap} modalType="map">
        <GoogleMap />
      </Modal>
      <form onSubmit={formik.handleSubmit}>
        <p>{t("contact.contact")}</p>
        <p>
          <label htmlFor="firstName">
            {t("contact.firstName")}
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </p>
        {formik.touched.firstName && formik.errors.firstName ? (
          <p className="form-error">{formik.errors.firstName}</p>
        ) : null}

        <p>
          <label htmlFor="lastName">
            {t("contact.lastName")}
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </p>
        {formik.touched.lastName && formik.errors.lastName ? (
          <p className="form-error">{formik.errors.lastName}</p>
        ) : null}

        <p>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </p>
        {formik.touched.email && formik.errors.email ? (
          <p className="form-error">{formik.errors.email}</p>
        ) : null}

        <p>
          <label htmlFor="information">
            {t("contact.message")}
          </label>
          <textarea
            id="information"
            type="text"
            name="information"
            value={formik.values.information}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
          />
        </p>
        {formik.touched.information && formik.errors.information ? (
          <p className="form-error">{formik.errors.information}</p>
        ) : null}

        <div className="actions">
          <button
            type="button"
            className="button"
            onClick={() => {
              setShowMap(true);
            }}
          >
            {t("contact.ourLocation")}
          </button>
          <button className="button" type="submit">
            {t("contact.send")}
          </button>
        </div>
      </form>
    </>
  );
};


 const action =
  (dispatch, language) =>
  async ({ request }) => {
    const formData = await request.formData();

    const { method } = await request;

    let contactData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      information: formData.get("information"),
    };

    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: i18n.t("common.sending"),
        message: i18n.t("common.sendingData"),
      })
    );

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/contact?language=${language}`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
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

    const responseData = await response.json();

    dispatch(
      uiActions.showNotification({
        status: "success",
        title: i18n.t("common.success"),
        message: responseData.message,
      })
    );
  };


ContactPage.action = action;
export default ContactPage;