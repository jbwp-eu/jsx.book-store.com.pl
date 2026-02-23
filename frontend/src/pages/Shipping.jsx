import { useNavigation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveShippingAddress } from "../slices/cartSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CheckoutSteps from "../components/CheckoutSteps";
import { useFormik } from "formik";
import { object, string } from "yup";

const ShippingPage = () => {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress } = useSelector((state) => state.cart);

  const formik = useFormik({
    initialValues: {
      address: shippingAddress?.address || "",
      city: shippingAddress?.city || "",
      postal_code: shippingAddress?.postal_code || "",
      country: "Polska",
    },
    validationSchema: object({
      address: string().required(t("shipping.pleaseEnterAddress")),
      city: string().required(t("shipping.pleaseEnterCity")),
      postal_code: string().required(t("shipping.pleaseEnterPostalCode")),
      country: string().required(t("shipping.pleaseEnterCountry")),
    }),
    onSubmit: (values) => {
      dispatch(saveShippingAddress(values));
      navigate("/payment");
    },
  });

  const isSubmitting = navigation.state === "submitting";

  const cancelHandler = () => {
    navigate("..");
  };

  return (
    <div className="shipping">
      <CheckoutSteps step1 step2 />
      <form onSubmit={formik.handleSubmit}>
        <h1>{t("shipping.title")}</h1>
        <p>
          <label htmlFor="address">
            {t("shipping.address")}
          </label>
          <input
            id="address"
            type="text"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="address"
          />
        </p>
        {formik.touched.address && formik.errors.address ? (
          <p className="form-error">{formik.errors.address}</p>
        ) : null}
        <p>
          <label htmlFor="city">{t("shipping.city")}</label>
          <input
            id="city"
            type="text"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="city"
          />
        </p>
        {formik.touched.city && formik.errors.city ? (
          <p className="form-error">{formik.errors.city}</p>
        ) : null}
        <p>
          <label htmlFor="postal_code">
            {t("shipping.postalCode")}
          </label>
          <input
            id="postal_code"
            type="text"
            value={formik.values.postal_code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="postal_code"
          />
        </p>
        {formik.touched.postal_code && formik.errors.postal_code ? (
          <p className="form-error">{formik.errors.postal_code}</p>
        ) : null}
        <p>
          <label htmlFor="country">
            {t("shipping.country")}
          </label>
          <input
            id="country"
            type="text"
            // value={formik.values.country}
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            // name='country'
            defaultValue="Polska"
            readOnly={true}
          />
        </p>
        {/* {formik.touched.country && formik.errors.country ? <p style={{ color: 'red' }}>{formik.errors.country}</p> : null} */}

        <div className="actions">
          <button
            className="button"
            type="button"
            disabled={isSubmitting}
            onClick={cancelHandler}
          >
            {t("common.cancel")}
          </button>
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? t("common.submitting") : t("shipping.continue")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingPage;
