import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Outlet } from "react-router-dom";

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE
);

const StripePayment = ({ clientSecret, language }) => {
  const appearance = {
    theme: "stripe",
  };
  const loader = "auto";
  const locale = language === "PL" ? "pl" : "en";

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements
      key={clientSecret}
      options={{ clientSecret, appearance, loader, locale }}
      stripe={stripePromise}
    >
      <Outlet />
    </Elements>
  );
};

export default StripePayment;
