import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  password: "",
  address: "",
  clef: 5,
};

const Web3slice = createSlice({
  name: "Web3",
  initialState,
  reducers: {
    updateAddress(state, action) {
      state.address = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
  },
});

export const { updateAddress } = Web3slice.actions;
export default Web3slice.reducer;
