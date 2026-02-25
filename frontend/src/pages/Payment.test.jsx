import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import uiReducer from "../slices/uiSlice";
import authReducer from "../slices/authSlice";
import { savePaymentMethod } from "../slices/cartSlice";
import PaymentPage from "./Payment.jsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useNavigation: () => ({ state: "idle" }),
  };
});

const createStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      ui: uiReducer,
      auth: authReducer,
    },
    preloadedState: {
      cart: {
        cartItems: [],
        itemsQuantity: 0,
        itemsPrice: "0.00",
        shippingPrice: "0.00",
        shippingAddress: {},
        paymentMethod: "",
      },
    },
  });
};

const renderPayment = (store = createStore()) => {
  const router = createMemoryRouter(
    [{ path: "/payment", element: <PaymentPage /> }],
    { initialEntries: ["/payment"], initialIndex: 0 }
  );
  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

describe("Payment page", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
    mockNavigate.mockClear();
  });

  it("renders Payment title and form with PayPal and Stripe options", () => {
    renderPayment();
    expect(screen.getByRole("heading", { name: /payment method/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /select method/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /paypal/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /stripe/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /proceed/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows validation error when submitting without selecting payment method", async () => {
    const user = userEvent.setup();
    renderPayment();
    await user.click(screen.getByRole("button", { name: /proceed/i }));
    expect(await screen.findByText(/please select payment method/i)).toBeInTheDocument();
  });

  it("calls navigate with '..' when Cancel is clicked", async () => {
    const user = userEvent.setup();
    renderPayment();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith("..");
  });

  it("dispatches savePaymentMethod with PayPal and navigates to /placeorder when PayPal selected and submitted", async () => {
    const store = createStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");
    const user = userEvent.setup();
    renderPayment(store);

    await user.click(screen.getByRole("radio", { name: /paypal/i }));
    await user.click(screen.getByRole("button", { name: /proceed/i }));

    expect(dispatchSpy).toHaveBeenCalledWith(savePaymentMethod("PayPal"));
    expect(mockNavigate).toHaveBeenCalledWith("/placeorder");
  });

  it("dispatches savePaymentMethod with Stripe and navigates to /placeorder when Stripe selected and submitted", async () => {
    const store = createStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");
    const user = userEvent.setup();
    renderPayment(store);

    await user.click(screen.getByRole("radio", { name: /stripe/i }));
    await user.click(screen.getByRole("button", { name: /proceed/i }));

    expect(dispatchSpy).toHaveBeenCalledWith(savePaymentMethod("Stripe"));
    expect(mockNavigate).toHaveBeenCalledWith("/placeorder");
  });
});
