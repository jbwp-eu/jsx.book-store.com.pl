import { useNavigation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { savePaymentMethod } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useTranslation } from "react-i18next";

const PaymentPage = () => {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      paymentMethod: "",
    },
    validationSchema: object({
      paymentMethod: string().required(t("payment.pleaseSelectPayment")),
    }),
    onSubmit: (values) => {
      dispatch(savePaymentMethod(values.paymentMethod));
      navigate("/placeorder");
    },
  });

  const isSubmitting = navigation.state === "submitting";

  const cancelHandler = () => {
    navigate("..");
  };

  return (
    <div className="payment">
      <CheckoutSteps step1 step2 step3 />
      <form onSubmit={formik.handleSubmit}>
        <h1>{t("payment.title")}</h1>
        <h2>{t("payment.selectMethod")}</h2>
        <p>
          <label>
            <input
              id="payment"
              type="radio"
              name="paymentMethod"
              value="PayPal"
              checked={"PayPal" === formik.values.paymentMethod}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // disabled
              // onChange={(e) => setPaymentMethod(e.target.value)}
            />
            PayPal
          </label>
        </p>

        <p>
          <label>
            <input
              id="payment"
              type="radio"
              name="paymentMethod"
              value="Stripe"
              checked={"Stripe" === formik.values.paymentMethod}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Stripe
          </label>
        </p>

        {formik.touched.paymentMethod && formik.errors.paymentMethod ? (
          <p className="form-error">{formik.errors.paymentMethod}</p>
        ) : null}

        <div className="actions">
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? t("common.submitting") : t("payment.proceed")}
          </button>
          <button
            className="button"
            type="button"
            disabled={isSubmitting}
            onClick={cancelHandler}
          >
            {t("common.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
