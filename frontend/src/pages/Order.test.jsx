import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import uiReducer from "../slices/uiSlice";
import authReducer from "../slices/authSlice";
import OrderPage from "./Order.jsx";

vi.mock("../components/OrderInformation.jsx", () => ({
  default: () => <div data-testid="order-information">OrderInformation</div>,
}));

vi.mock("../components/OrderSummary.jsx", () => ({
  default: () => <div data-testid="order-summary">OrderSummary</div>,
}));

const mockOrder = {
  id: "order-123",
  user: { name: "Test User", email: "test@example.com" },
  orderItems: [],
  shippingAddress: {
    address: "ul. Test 1",
    city: "Warsaw",
    postal_code: "00-001",
    country: "Polska",
  },
  paymentMethod: "PayPal",
  isPaid: false,
  isDelivered: false,
  itemsPrice: "29.99",
  shippingPrice: "20.00",
  totalPrice: "49.99",
};

const createStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      ui: uiReducer,
      auth: authReducer,
    },
  });
};

const renderOrder = (loaderData = mockOrder) => {
  const loader = () => Promise.resolve(loaderData);
  const router = createMemoryRouter(
    [
      {
        path: "/order/:id/checkout",
        element: <OrderPage />,
        loader,
      },
    ],
    { initialEntries: ["/order/order-123/checkout"], initialIndex: 0 }
  );
  return render(
    <Provider store={createStore()}>
      <RouterProvider router={router} />
    </Provider>
  );
};

describe("Order page", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key) => (key === "userInfo" ? "{}" : null)),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders order id and order content when loader returns order data", async () => {
    renderOrder(mockOrder);
    const heading = await screen.findByRole("heading", { name: /order id:\s*order-123/i });
    expect(heading).toBeInTheDocument();
    expect(await screen.findByTestId("order-information")).toBeInTheDocument();
    expect(await screen.findByTestId("order-summary")).toBeInTheDocument();
  });

  it("renders not created message when loader returns null", async () => {
    renderOrder(null);
    expect(await screen.findByText(/order has not been created/i)).toBeInTheDocument();
  });
});
