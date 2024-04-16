import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { User } from '@shared';

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, { payload: user }: PayloadAction<User>) {
      state.user = user;
      state.isLoggedIn = true;
    },
    userSignedOut(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, userSignedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
