import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,        
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth,updateUser } = authSlice.actions;
export default authSlice.reducer;
