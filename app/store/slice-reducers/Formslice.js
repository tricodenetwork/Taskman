import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  visible2: false,
  visible3: false,
  search: "",
  filter: "Name",
  role: "",
  menu: false,
  notify: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setVisible(state, action) {
      state.visible = !state.visible;
    },
    setVisible2(state, action) {
      state.visible2 = !state.visible2;
    },
    setVisible3(state, action) {
      state.visible3 = !state.visible3;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setMenu(state, action) {
      if (state.notify == true) {
        state.notify = false;
      }
      state.menu = !state.menu;
    },
    openNotification(state, action) {
      if (state.menu == true) {
        state.menu = false;
      }
      state.notify = !state.notify;
    },
  },
});

export const {
  setVisible,
  setVisible2,
  setVisible3,
  setSearch,
  setFilter,
  setRole,
  setMenu,
  openNotification,
} = formSlice.actions;

export default formSlice.reducer;
