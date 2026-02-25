import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import uiReducer from "../slices/uiSlice";
import authReducer from "../slices/authSlice";
import { saveShippingAddress } from "../slices/cartSlice";
import ShippingPage from "./Shipping.jsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useNavigation: () => ({ state: "idle" }),
  };
});

const createStore = (shippingAddress = {}) => {
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
        shippingAddress,
        paymentMethod: "",
      },
    },
  });
};

const renderShipping = (store = createStore()) => {
  const router = createMemoryRouter(
    [{ path: "/shipping", element: <ShippingPage /> }],
    { initialEntries: ["/shipping"], initialIndex: 0 }
  );
  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

describe("Shipping page", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
    mockNavigate.mockClear();
  });

  it("renders Shipping title and form fields", () => {
    renderShipping();
    expect(screen.getByRole("heading", { name: /shipping/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("shows validation error when address is empty and touched", async () => {
    const user = userEvent.setup();
    renderShipping();
    const addressInput = screen.getByLabelText(/address/i);
    await user.clear(addressInput);
    await user.tab();
    expect(await screen.findByText(/please enter address/i)).toBeInTheDocument();
  });

  it("shows validation error when city is empty and touched", async () => {
    const user = userEvent.setup();
    renderShipping();
    const cityInput = screen.getByLabelText(/city/i);
    await user.clear(cityInput);
    await user.tab();
    expect(await screen.findByText(/please enter city/i)).toBeInTheDocument();
  });

  it("calls navigate with '..' when Cancel is clicked", async () => {
    const user = userEvent.setup();
    renderShipping();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith("..");
  });

  it("dispatches saveShippingAddress and navigates to /payment when form is valid and submitted", async () => {
    const store = createStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");
    const user = userEvent.setup();
    renderShipping(store);

    await user.type(screen.getByLabelText(/address/i), "ul. Test 1");
    await user.type(screen.getByLabelText(/city/i), "Warsaw");
    await user.type(screen.getByLabelText(/postal code/i), "00-001");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(dispatchSpy).toHaveBeenCalledWith(
      saveShippingAddress({
        address: "ul. Test 1",
        city: "Warsaw",
        postal_code: "00-001",
        country: "Polska",
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/payment");
  });
});
