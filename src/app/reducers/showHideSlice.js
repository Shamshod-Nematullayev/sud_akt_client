import { createSlice } from "@reduxjs/toolkit";

const initialState = { show: false };

export const counterSlice = createSlice({
  name: "show_hide",
  initialState,
  reducers: {
    show: (state) => {
      state.show = true;
    },
    hide: (state) => {
      state.show = false;
    },
  },
});

export const { hide, show } = counterSlice.actions;
export default counterSlice.reducer;
