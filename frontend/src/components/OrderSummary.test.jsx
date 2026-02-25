import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import uiReducer from "../slices/uiSlice";
import authReducer from "../slices/authSlice";
import OrderSummary from "./OrderSummary.jsx";

const mockNavigate = vi.fn();
const mockSubmit = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSubmit: () => mockSubmit,
  };
});

vi.mock("@paypal/react-paypal-js", () => ({
  PayPalButtons: () => <div data-testid="paypal-buttons">PayPal</div>,
  usePayPalScriptReducer: () => [{ isPending: false }, vi.fn()],
}));

vi.mock("./StripePayment.jsx", () => ({
  default: () => <div data-testid="stripe-payment">Stripe</div>,
}));

const defaultData = {
  id: "order-1",
  itemsPrice: "29.99",
  shippingPrice: "20.00",
  totalPrice: "49.99",
  isPaid: false,
  isDelivered: false,
  paymentMethod: "PayPal",
};

const createStore = (uiState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      ui: uiReducer,
      auth: authReducer,
    },
    preloadedState: {
      ui: {
        language: "en",
        currency: "PLN",
        ...uiState,
      },
    },
  });
};

const renderOrderSummary = (data = defaultData, store = createStore(), userInfo = {}) => {
  const router = createMemoryRouter(
    [
      {
        path: "/order/:id/checkout",
        element: <OrderSummary data={data} />,
      },
    ],
    { initialEntries: ["/order/order-1/checkout"], initialIndex: 0 }
  );
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key) => (key === "userInfo" ? JSON.stringify(userInfo) : null)),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  });
  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

describe("OrderSummary", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
    mockNavigate.mockClear();
    mockSubmit.mockClear();
    vi.stubGlobal("fetch", vi.fn((url) => {
      if (url.includes("paypal")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ clientId: "test-paypal-id" }),
        });
      }
      if (url.includes("create-payment-intent")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ clientSecret: "test_secret" }),
        });
      }
      return Promise.reject(new Error("Unexpected fetch"));
    }));
  });

  it("renders title and price breakdown", async () => {
    renderOrderSummary(defaultData);
    expect(await screen.findByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByText(/items:/i)).toBeInTheDocument();
    expect(screen.getByText(/shipping:/i)).toBeInTheDocument();
    expect(screen.getByText(/total:/i)).toBeInTheDocument();
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
    expect(screen.getByText(/20\.00/)).toBeInTheDocument();
    expect(screen.getByText(/49\.99/)).toBeInTheDocument();
  });

  it("shows PayPal payment section when not paid and paymentMethod is PayPal", async () => {
    renderOrderSummary({ ...defaultData, paymentMethod: "PayPal" });
    expect(await screen.findByTestId("paypal-buttons")).toBeInTheDocument();
  });

  it("shows Stripe payment section when not paid and paymentMethod is Stripe", async () => {
    renderOrderSummary({ ...defaultData, paymentMethod: "Stripe" });
    expect(await screen.findByTestId("stripe-payment")).toBeInTheDocument();
  });

  it("does not show Mark as Delivered when user is not admin", async () => {
    renderOrderSummary(
      { ...defaultData, isPaid: true, isDelivered: false },
      createStore(),
      { isAdmin: false }
    );
    await screen.findByText(/order summary/i);
    expect(screen.queryByRole("button", { name: /mark as delivered/i })).not.toBeInTheDocument();
  });

  it("does not show Mark as Delivered when order is not paid", async () => {
    renderOrderSummary(
      { ...defaultData, isPaid: false, isDelivered: false },
      createStore(),
      { isAdmin: true }
    );
    await screen.findByText(/order summary/i);
    expect(screen.queryByRole("button", { name: /mark as delivered/i })).not.toBeInTheDocument();
  });

  it("does not show Mark as Delivered when order is already delivered", async () => {
    renderOrderSummary(
      { ...defaultData, isPaid: true, isDelivered: true },
      createStore(),
      { isAdmin: true }
    );
    await screen.findByText(/order summary/i);
    expect(screen.queryByRole("button", { name: /mark as delivered/i })).not.toBeInTheDocument();
  });

  it("shows Mark as Delivered and calls submit with put when admin and order paid but not delivered", async () => {
    const user = userEvent.setup();
    renderOrderSummary(
      { ...defaultData, isPaid: true, isDelivered: false },
      createStore(),
      { isAdmin: true }
    );
    const button = await screen.findByRole("button", { name: /mark as delivered/i });
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(mockSubmit).toHaveBeenCalledWith(null, { method: "put" });
  });
});
