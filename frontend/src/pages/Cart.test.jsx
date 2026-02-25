import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import uiReducer from "../slices/uiSlice";
import authReducer from "../slices/authSlice";
import CartPage from "./Cart.jsx";

vi.mock("../components/CartItem.jsx", () => {
  const React = require("react");
  return {
    default: ({ item }) =>
      React.createElement("li", { "data-testid": "cart-item" }, item.title),
  };
});

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

const renderCart = (store = createStore()) => {
  const router = createMemoryRouter(
    [{ path: "/cart", element: <CartPage /> }],
    { initialEntries: ["/cart"], initialIndex: 0 }
  );
  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

describe("Cart page", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
    mockNavigate.mockClear();
  });

  it("renders cart title", () => {
    renderCart();
    expect(screen.getByRole("heading", { name: /shopping cart/i })).toBeInTheDocument();
  });

  it("renders empty message and Go back link when cart is empty", () => {
    renderCart();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go back/i })).toBeInTheDocument();
  });

  it("disables Proceed To Checkout when cart is empty", () => {
    renderCart();
    expect(screen.getByRole("button", { name: /proceed to checkout/i })).toBeDisabled();
  });

  it("renders cart items and subtotal when cart has items", () => {
    const store = createStore({
      cartItems: [
        {
          id: "1",
          _id: "1",
          title: "Test Book",
          price: 29.99,
          qty: 2,
          image: "",
          countInStock: 10,
        },
      ],
      itemsQuantity: 2,
      itemsPrice: "59.98",
    });
    
    renderCart(store);
    expect(screen.getByTestId("cart-item")).toHaveTextContent("Test Book");
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    expect(screen.getByText(/59\.98/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /proceed to checkout/i })).not.toBeDisabled();
  });

  it("navigates to login with redirect when Proceed To Checkout is clicked", async () => {
    const store = createStore({
      cartItems: [
        { id: "1", _id: "1", title: "Book", price: 10, qty: 1, image: "", countInStock: 5 },
      ],
      itemsQuantity: 1,
      itemsPrice: "10.00",
    });
    const user = userEvent.setup();
    renderCart(store);
    await user.click(screen.getByRole("button", { name: /proceed to checkout/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login?redirect=/shipping");
  });
});
