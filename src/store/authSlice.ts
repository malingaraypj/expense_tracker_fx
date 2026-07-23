import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AuthResponse } from "../types";

interface AuthState {
  token: string | null;
  user: Omit<AuthResponse, "token"> | null;
  isAuthenticated: boolean;
}

const initialToken = localStorage.getItem("token");
const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

const initialState: AuthState = {
  token: initialToken,
  user: initialUser,
  isAuthenticated: !!initialToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { token, ...user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
