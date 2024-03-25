import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { User } from '@shared';

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userSignedIn(state, { payload: user }: PayloadAction<User>) {
      state.user = user;
    },
    userSignedOut(state) {
      state.user = null;
    },
  },
});

export const { userSignedIn, userSignedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
