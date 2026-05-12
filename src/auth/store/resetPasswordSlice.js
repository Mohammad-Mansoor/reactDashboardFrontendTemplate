import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  channel: null,
  otpVerified: false,
  resetToken: null,
  expiresAt: null,
};

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    setResetEmailAndChannel: (state, action) => {
      state.email = action.payload.email;
      state.channel = action.payload.channel;
    },
    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload.verified;
      if (action.payload.resetToken) {
        state.resetToken = action.payload.resetToken;
      }
      if (action.payload.expiresAt) {
        state.expiresAt = action.payload.expiresAt;
      }
    },
    resetFlow: (state) => {
      state.email = "";
      state.channel = null;
      state.otpVerified = false;
      state.resetToken = null;
      state.expiresAt = null;
    },
  },
});

export const { setResetEmailAndChannel, setOtpVerified, resetFlow } =
  resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
