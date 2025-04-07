// redux-help/slices/cart.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../../helper/AxiosInstance";
import { isLoading } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};
// Thunk để thực hiện đăng nhập
export const loginUser = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    console.log("Dữ liệu gửi đi:", body);
    try {
      const response = await AxiosInstance().post("/users/login", body);
      console.log("Auth Slice >>>>>>>", response);

      if (!response.token || !response.user) {
        return rejectWithValue("Thiếu thông tin user hoặc token!");
      }

      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("userId", response.user.id);

      return { user: response.user, token: response.token };
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại!"
      );
    }
  }
);

// Thunk để đăng nhập bằng Google
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async ({ googleAccessToken }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().post("/users/googleLogin", {
        googleAccessToken,
      });
      if (!response.token || !response.user) {
        return rejectWithValue("Thiếu thông tin user hoặc token!");
      }

      // Lưu token và userId vào AsyncStorage
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("userId", response.user.id);

      return { user: response.user, token: response.token };
    } catch (error) {
      console.error(
        "Lỗi đăng nhập Google:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập bằng Google thất bại"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isSuccess = false;
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log("Redux cập nhật user:", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("Lỗi đăng nhập từ Redux:", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        // console.log("Redux cập nhật user (loginWithGoogle):", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        console.error(
          "Lỗi đăng nhập từ Redux (loginWithGoogle):",
          action.payload
        );
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
