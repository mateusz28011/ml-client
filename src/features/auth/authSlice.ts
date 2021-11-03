import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User } from '../../app/services/split/auth';
import type { RootState } from '../../app/store';

type AuthState = {
  user: User | null;
};

const slice = createSlice({
  name: 'auth',
  initialState: { user: null } as AuthState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload.user;
      }
    );
  },
});

export const { setUser, clearUser } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
