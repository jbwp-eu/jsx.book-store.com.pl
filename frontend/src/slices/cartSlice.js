import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";


const initialState = {
  cartItems: [],
  itemsQuantity: 0,
  itemsPrice: 0,
  shippingPrice: 0,
  shippingAddress: {},
  paymentMethod: ''
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = action.payload;

      const existingItem = state.cartItems.find(item => item.id === newItem.id);

      if (existingItem) {
        state.cartItems = state.cartItems.map(item => item.id === existingItem.id ? newItem : item)
      } else {
        state.cartItems = [...state.cartItems, newItem];
      }
      return updateCart(state);
    },
    removeItemFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== id);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    }
  }
});


export const {
  addItemToCart,
  removeItemFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;


export default cartSlice.reducer;