// redux-help/slices/cart.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { cart: [], total: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = state.cart.find(
        (product) => product.id === action.payload.id
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.cart.push({
          id: action.payload.id,
          namePR: action.payload.namePR,
          imagePR: action.payload.imagePR,
          pricePR: action.payload.pricePR,
          quantity: action.payload.quantity,
          traitPR: action.payload.traitPR,
        });
      }
      state.total = state.cart.reduce(
        (sum, item) => sum + item.pricePR * item.quantity,
        0
      );
    },
    removeToCart(state, action) {
      state.cart = state.cart.filter(
        (product) => product.id !== action.payload.id
      );
      state.total = state.cart.reduce(
        (sum, item) => sum + item.pricePR * item.quantity,
        0
      );
    },
    increaseQuantity(state, action) {
      const item = state.cart.find(
        (product) => product.id === action.payload.id
      );
      if (item) {
        item.quantity += 1;
      }
      state.total = state.cart.reduce(
        (sum, item) => sum + item.pricePR * item.quantity,
        0
      );
    },
    decreaseQuantity(state, action) {
      const item = state.cart.find(
        (product) => product.id === action.payload.id
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      state.total = state.cart.reduce(
        (sum, item) => sum + item.pricePR * item.quantity,
        0
      );
    },
    updateCart(state, action) {
      const item = state.cart.find(
        (product) => product.id === action.payload.id
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.total = state.cart.reduce(
        (sum, item) => sum + item.pricePR * item.quantity,
        0
      );
    },
    clearCart(state) {
      state.cart = [];
      state.total = 0;
    },
  },
});

export const {
  addToCart,
  removeToCart,
  increaseQuantity,
  decreaseQuantity,
  updateCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
