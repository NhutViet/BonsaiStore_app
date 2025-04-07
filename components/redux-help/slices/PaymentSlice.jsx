// redux-help/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../../helper/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  cart: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

// Thunk để thanh toán
export const checkout = createAsyncThunk(
  "cart/checkout",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().post(
        "/orders/checkout",
        orderData
      );
      return response;
    } catch (error) {
      console.error("Lỗi thanh toán:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Thanh toán thất bại!"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = null; // Xóa giỏ hàng sau khi thanh toán
      })
      .addCase(checkout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
