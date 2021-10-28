import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  status: 'pending'
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.currentUser = payload;
      state.status = 'idle';
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.status = 'idle'
    },
  },
})

export const user = (state) => state.user.currentUser;

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;