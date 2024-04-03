// tableSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const tableSlice = createSlice({
  name: "table",
  initialState: {
    order: "asc",
    orderBy: "count",
    selected: [],
    page: 0,
    rowsPerPage: 5,
    data: { items: [] },
  },
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setOrderBy: (state, action) => {
      state.orderBy = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const {
  setOrder,
  setOrderBy,
  setSelected,
  setPage,
  setRowsPerPage,
  setData,
} = tableSlice.actions;

export default tableSlice.reducer;
