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
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
