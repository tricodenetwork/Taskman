import { createSlice } from "@reduxjs/toolkit";

const currentDay = new Date().getDay();
const currentHour = new Date().getHours();

// Check if it's a weekend (Saturday or Sunday)
const isWeekend = currentDay === 0 || currentDay === 6;

// Check if it's within the allowed time range on weekdays (8am to 4pm)
const isAllowedTime = currentHour >= 8 && currentHour < 16;

const initialState = {
  visible: false,
  visible2: false,
  visible3: false,
  search: "",
  filter: "Name",
  menu: false,
  isAllowedTime: isAllowedTime,
  isWeekend: isWeekend,
  clock: "00:00",
  holiday: [new Date()],
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
    setClock(state, action) {
      state.clock = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setMenu(state, action) {
      state.menu = !state.menu;
    },
    AddHoliday(state, action) {
      state.holiday.push(action.payload);
    },
  },
});

export const {
  setVisible,
  setVisible2,
  setVisible3,
  setSearch,
  setFilter,
  setMenu,
  setClock,
  AddHoliday,
} = formSlice.actions;

export default formSlice.reducer;
