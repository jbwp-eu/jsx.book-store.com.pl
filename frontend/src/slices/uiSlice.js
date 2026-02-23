import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { notification: null, language: import.meta.env.VITE_LANGUAGE, currency: import.meta.env.VITE_CURRENCY },
  reducers: {
    showNotification(state, action) {
      if (action.payload) {
        state.notification = {
          status: action.payload.status,
          title: action.payload.title,
          message: action.payload.message,
        }

      } else {
        state.notification = null;
      }
    },
    setLanguage(state, action) {
      if (action.payload) {
        state.language = action.payload
      }
    },
    setCurrency(state, action) {
      if (action.payload) {
        state.currency = action.payload
      }
    }
  },
}
);

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
