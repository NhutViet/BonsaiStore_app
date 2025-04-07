import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import cartSlice from "../slices/cart";
import AuthReducer from "../slices/AuthSlice";
import ProductReducer from "../slices/ProductSlice";
import paymentReducer from "../slices/PaymentSlice";
import notificationReducer from "../slices/notificationSlice";

const persistAuthConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["user", "token"],
};

const rootReducer = combineReducers({
  auth: persistReducer(persistAuthConfig, AuthReducer),
  product: ProductReducer,
  payment: paymentReducer,
  notification: notificationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
