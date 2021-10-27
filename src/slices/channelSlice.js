import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentChannel: null,
};

export const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setCurrentChannel: (state, { payload }) => {
      state.currentChannel = payload
    },
  },
})

export const { setCurrentChannel } = channelSlice.actions

export default channelSlice.reducer