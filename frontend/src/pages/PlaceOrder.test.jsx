import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import uiReducer from "../slices/uiSlice";
import authReducer from "../slices/authSlice";
import PlaceOrderPage from "./PlaceOrder.jsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const fullShippingAddress = {
  address: "ul. Test 1",
  city: "Warsaw",
  postal_code: "00-001",
  country: "Polska",
};

const createStore = (cartState = {}) => {
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
        ...cartState,
      },
    },
  });
};

const renderPlaceOrder = (store = createStore()) => {
  const router = createMemoryRouter(
    [{ path: "/placeorder", element: <PlaceOrderPage /> }],
    { initialEntries: ["/placeorder"], initialIndex: 0 }
  );
  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

describe("PlaceOrder page", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
    mockNavigate.mockClear();
  });

  it("navigates to /shipping when shipping address is incomplete", async () => {
    renderPlaceOrder();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/shipping");
    });
  });

  it("navigates to /payment when shipping is complete but paymentMethod is empty", async () => {
    const store = createStore({
      shippingAddress: fullShippingAddress,
      paymentMethod: "",
    });
    renderPlaceOrder(store);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/payment");
    });
  });

  it("renders order summary and place order content when shipping and payment are set", async () => {
    const store = createStore({
      shippingAddress: fullShippingAddress,
      paymentMethod: "PayPal",
      cartItems: [
        { id: "1", title: "Book", price: 10, qty: 1, image: "", countInStock: 5 },
      ],
      itemsQuantity: 1,
      itemsPrice: "10.00",
      shippingPrice: "20.00",
      taxPrice: "2.30",
      totalPrice: "32.30",
    });
    renderPlaceOrder(store);
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
    expect(screen.getByRole("heading", { name: /shipping/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /order summary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /place order/i })).toBeInTheDocument();
  });

  it("displays shipping address and payment method when both are set", async () => {
    const store = createStore({
      shippingAddress: fullShippingAddress,
      paymentMethod: "Stripe",
    });
    renderPlaceOrder(store);
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
    expect(screen.getByText(/ul\. Test 1/)).toBeInTheDocument();
    expect(screen.getByText(/Warsaw/)).toBeInTheDocument();
    expect(screen.getByText(/Stripe/)).toBeInTheDocument();
  });
});
