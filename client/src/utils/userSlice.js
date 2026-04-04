import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    isAuthenticated: false,
    isInitialized: false, // Ensures we don't flash login button while checking cookies on load
    isAuthSidebarOpen: false, // Globally controls the auth login popup
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.isAuthSidebarOpen = false; // Close on login
    },
    logoutUser: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
    setAuthInitialized: (state) => {
      state.isInitialized = true;
    },
    setAuthSidebarOpen: (state, action) => {
      state.isAuthSidebarOpen = action.payload;
    }
  },
});

export const { loginSuccess, logoutUser, setAuthInitialized, setAuthSidebarOpen } = userSlice.actions;
export default userSlice.reducer;
