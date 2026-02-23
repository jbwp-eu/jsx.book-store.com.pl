const TAX = import.meta.env.VITE_VAT / 100;

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  state.itemsQuantity = state.cartItems.reduce((a, c) => a + c.qty, 0);

  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  state.shippingPrice = addDecimals(state.itemsPrice > 200 ? 0 : 20);

  state.taxPrice = addDecimals(TAX * state.itemsPrice);

  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
