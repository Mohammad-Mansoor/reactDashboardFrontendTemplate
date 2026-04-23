// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import authReducer from "./slices/authSlice";
import resetPasswordReducer from "../auth/store/resetPasswordSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    resetPassword: resetPasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
