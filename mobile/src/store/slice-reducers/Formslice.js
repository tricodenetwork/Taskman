import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  visible2: false,
  search: "",
  filter: "Name",
  role: "",
  menu: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setVisible(state, action) {
      state.visible = action.payload;
    },
    setVisible2(state, action) {
      state.visible2 = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setMenu(state, action) {
      state.menu = !state.menu;
    },
  },
});

export const {
  setVisible,
  setVisible2,
  setSearch,
  setFilter,
  setRole,
  setMenu,
} = formSlice.actions;

export default formSlice.reducer;
