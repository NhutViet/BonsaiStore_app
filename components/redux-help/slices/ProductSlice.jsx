import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../../helper/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  productsPlant: [],
  productsUtensils: [],
  productsPot: [],
  categories: [],
  productsByCategory: [],
  product: {},
  token: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

// Thunk để lấy danh sách sản phẩm Plant
const getProductPlant = createAsyncThunk(
  "products/getProductPlant",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().get("/products/type?type=plant");
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// Thunk để lấy danh sách sản phẩm Utensils
const getproductUtensils = createAsyncThunk(
  "products/getproductUtensils",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().get(
        "/products/type?type=utensils"
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// Thunk để lấy danh sách sản phẩm Utensils
const getproductPot = createAsyncThunk(
  "products/getproductPot",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().get("/products/type?type=pot");
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// Thunk để lấy chi tiết sản phẩm
const getProductDetail = createAsyncThunk(
  "product/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().get(`/products/detail/${id}`);
      return response.product;
    } catch (error) {
      return rejectWithValue(error.response.product);
    }
  }
);

// Thunk để get categories
const getCategories = createAsyncThunk(
  "products/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().get("/categories");
      return response.categories;
    } catch (error) {
      return rejectWithValue(error.response.categories);
    }
  }
);

// Thunk để  getProductByCategory
const getProductByCategory = createAsyncThunk(
  "products/getProductByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().get(
        `/products/categories?categoryId=${categoryId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState, // Sửa: Sử dụng initialState đã khai báo
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý getProductPlant
      .addCase(getProductPlant.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getProductPlant.fulfilled, (state, action) => {
        // console.log("Redux cập nhật productsPlant:", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.productsPlant = action.payload.productsPlant || action.payload; // Kiểm tra cấu trúc dữ liệu
      })
      .addCase(getProductPlant.rejected, (state, action) => {
        console.error("Lỗi get sản phẩm từ Redux:", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload.message || "Lỗi không xác định";
        state.productsPlant = [];
      })
      // Xử lý getProductUtensils
      .addCase(getproductUtensils.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getproductUtensils.fulfilled, (state, action) => {
        // console.log("Redux cập nhật getproductUtensils:", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.productsUtensils =
          action.payload.productsUtensils || action.payload; // Kiểm tra cấu trúc dữ liệu
      })
      .addCase(getproductUtensils.rejected, (state, action) => {
        console.error("Lỗi get sản phẩm từ Redux:", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload.message || "Lỗi không xác định";
        state.productsUtensils = [];
      })
      // Xử lý getProductPot
      .addCase(getproductPot.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getproductPot.fulfilled, (state, action) => {
        // console.log("Redux cập nhật getproductUtensils:", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.productsPot = action.payload.productsPot || action.payload; // Kiểm tra cấu trúc dữ liệu
      })
      .addCase(getproductPot.rejected, (state, action) => {
        console.error("Lỗi get sản phẩm từ Redux:", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload.message || "Lỗi không xác định";
        state.productsPot = [];
      })
      // Xử lý getProductDetail
      .addCase(getProductDetail.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        console.error("Lỗi get chi tiết sản phẩm từ Redux:", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload.message || "Lỗi không xác định";
        state.product = {};
      })
      // Xử lý getCategories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        console.log("Redux cập nhật getproductUtensils:", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload.data || action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        console.error("Lỗi get chi tiết categori từ Redux:", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload.message || "Lỗi không xác định";
        state.categories = [];
      })
      // Xử lý getProductByCategory
      .addCase(getProductByCategory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getProductByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.productsByCategory = action.payload;
      })
      .addCase(getProductByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload.message || "Lỗi không xác định";
        state.productsByCategory = [];
      });
  },
});

export {
  getProductPlant,
  getProductDetail,
  getproductUtensils,
  getproductPot,
  getCategories,
  getProductByCategory,
};
export default productSlice.reducer;
