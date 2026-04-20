import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import agent from "../../agent";

interface LoginCredentials {
  email: string;
  password: string;
}

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,
  error: null as string | null,
};

export const login = createAsyncThunk<
  string,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await agent.post("/auth/login", credentials);
      const { accessToken } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await agent.post("/auth/logout");
    } catch (error: any) {
      // Even if API fails, we usually want to clear local state
      console.error("Logout API failed", error);
    } finally {
      dispatch(logout());
    }
  }
);

export const logoutAll = createAsyncThunk(
  "auth/logoutAll",
  async (_, { dispatch }) => {
    try {
      await agent.post("/auth/logout-all");
    } catch (error: any) {
      console.error("Logout all API failed", error);
    } finally {
      dispatch(logout());
    }
  }
);

export const logoutOther = createAsyncThunk(
  "auth/logoutOther",
  async () => {
    try {
      await agent.post("/auth/logout-other");
    } catch (error: any) {
      console.error("Logout other API failed", error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
