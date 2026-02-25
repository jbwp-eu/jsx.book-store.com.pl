import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "../store";
import PriceAndQuantity from "./PriceAndQuantity.jsx";

const defaultProduct = {
  price: 29.99,
  countInStock: 5,
};

const renderPriceAndQuantity = (product = defaultProduct, onAddToCartHandler = vi.fn()) => {
  return render(
    <Provider store={store}>
      <PriceAndQuantity product={product} onAddToCartHandler={onAddToCartHandler} />
    </Provider>
  );
};

describe("PriceAndQuantity", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
  });

  it("renders price and In Stock when countInStock > 0", () => {
    renderPriceAndQuantity();
    expect(screen.getByText(/price:/i)).toBeInTheDocument();
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
    expect(screen.getByText(/in stock/i)).toBeInTheDocument();
  });

  it("renders Out of Stock when countInStock is 0", () => {
    renderPriceAndQuantity({ price: 19.99, countInStock: 0 });
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it("renders quantity select with options 0 through countInStock, default 1", () => {
    renderPriceAndQuantity({ price: 10, countInStock: 3 });
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("1");
    expect(screen.getByRole("option", { name: "0" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "3" })).toBeInTheDocument();
  });

  it("Add to Cart button is disabled when countInStock is 0", () => {
    renderPriceAndQuantity({ price: 10, countInStock: 0 });
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeDisabled();
  });

  it("Add to Cart button is disabled when quantity is 0", async () => {
    const user = userEvent.setup();
    renderPriceAndQuantity({ price: 10, countInStock: 2 });
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "0");
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeDisabled();
  });

  it("calls onAddToCartHandler with selected quantity when Add to Cart is clicked", async () => {
    const onAddToCartHandler = vi.fn();
    const user = userEvent.setup();
    renderPriceAndQuantity(defaultProduct, onAddToCartHandler);
    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(onAddToCartHandler).toHaveBeenCalledTimes(1);
    expect(onAddToCartHandler).toHaveBeenCalledWith(1);
  });

  it("calls onAddToCartHandler with updated quantity after changing select", async () => {
    const onAddToCartHandler = vi.fn();
    const user = userEvent.setup();
    renderPriceAndQuantity(defaultProduct, onAddToCartHandler);
    await user.selectOptions(screen.getByRole("combobox"), "3");
    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(onAddToCartHandler).toHaveBeenCalledWith(3);
  });
});
