import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "../Features/tableSlice.js";

const store = configureStore({
  reducer: {
    table: tableReducer,
  },
});

export default store;
