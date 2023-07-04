import { configureStore } from "@reduxjs/toolkit";
import showHideSlice from "./reducers/showHideSlice";

export const store = configureStore({
  reducer: {
    showHide: showHideSlice,
  },
});
