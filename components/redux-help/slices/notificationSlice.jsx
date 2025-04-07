// redux-help/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../../helper/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  notifications: [],
  history: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

// Thunk để lấy danh sách thông báo
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        return rejectWithValue(
          "Không tìm thấy userId! Vui lòng đăng nhập lại."
        );
      }
      const response = await AxiosInstance().get(
        `/notification/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi lấy thông báo:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Lấy thông báo thất bại!"
      );
    }
  }
);

// Thunk để lấy danh sách lich su mau hang
export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        return rejectWithValue(
          "Không tìm thấy userId! Vui lòng đăng nhập lại."
        );
      }
      const response = await AxiosInstance().get(`order/history/${userId}`);
      return response.orders || [];
    } catch (error) {
      console.error(
        "Lỗi lấy thông báo:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Lấy thông báo thất bại!"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lấy danh sách thông báo
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Lấy danh sách thông báo lich su
      .addCase(fetchHistory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default notificationSlice.reducer;
