import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  service: "",
  location: {},
  long: 0,
  lat: 0,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setVisible(state, action) {
      state.visible = action.payload;
    },
    setLocale(state, action) {
      state.location = action.payload;
    },
    setLong(state, action) {
      state.long = action.payload;
    },
    setLat(state, action) {
      state.lat = action.payload;
    },
  },
});

export const { setVisible, setLocale, setLong, setLat } = formSlice.actions;

export default formSlice.reducer;
