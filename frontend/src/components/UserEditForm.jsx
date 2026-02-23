import { useLoaderData, useSubmit } from "react-router-dom";
import { useFormik } from "formik";
import { object, string } from "yup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const UserEditForm = () => {
  const user = useLoaderData();
  const submit = useSubmit();
  const { t } = useTranslation();

  let formData = new FormData();

  const formik = useFormik({
    initialValues: {
      name: user.name || "",
      email: user.email || "",
      isAdmin: user.isAdmin || false,
    },

    validationSchema: object({
      name: string().required("Please enter name"),
      email: string()
        .required("Please enter email address")
        .email("Email address must be a valid address"),
    }),

    onSubmit: (values) => {
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("isAdmin", values.isAdmin);

      submit(formData, { method: "put" });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1>{t("userEditForm.title")}</h1>
      <p>
        <label htmlFor="name">{t("userEditForm.name")}</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        ></input>
      </p>
      {formik.touched.name && formik.errors.name ? (
        <p className="form-error">{formik.errors.name}</p>
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
        ></input>
      </p>
      {formik.touched.email && formik.errors.email ? (
        <p className="form-error">{formik.errors.email}</p>
      ) : null}

      <p className="checkbox">
        <FormControlLabel
          control={<Checkbox checked={formik.values.isAdmin} />}
          label="is Admin"
          name="isAdmin"
          onChange={formik.handleChange}
        />
      </p>

      <button type="submit" className="button">
        {t("userEditForm.update")}
      </button>
    </form>
  );
};

export default UserEditForm;
