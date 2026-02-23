// import PurchaseReceiptEmail from "../components/PurchaseReceiptEmail";

// import { Resend } from "resend";

const CURRENCY_FORMATTER = new Intl.NumberFormat("pl", {
  // currency: "USD",
  currency: "PLN",
  style: "currency",
  minimumFractionDigits: 2,
});

// Format currency using the formatter above

// const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);

// const { REACT_APP_APP_NAME } = process.env;

// const { REACT_APP_SENDER_EMAIL } = process.env;

export function formatCurrency(amount) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else return "NaN";
}
