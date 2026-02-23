import { configureStore } from '@reduxjs/toolkit';
import cartSliceReducer from './slices/cartSlice.js';
import authSliceReducer from './slices/authSlice.js';
import uiSliceReducer from './slices/uiSlice.js';

const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    auth: authSliceReducer,
    ui: uiSliceReducer,
  }
})

export default store;
