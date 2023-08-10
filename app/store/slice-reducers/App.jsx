import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  multipleJobs: [],
  handler: [],
};

const App = createSlice({
  name: "App",
  initialState,
  reducers: {
    setMulti(state, action) {
      const index = state.multipleJobs.indexOf(action.payload);
      if (index !== -1) {
        state.multipleJobs.splice(index, 1);
      } else {
        state.multipleJobs.push(action.payload);
      }
    },
    resetMulti(state) {
      state.multipleJobs = [];
    },
    setHandler(state, action) {
      state.handler = action.payload;
    },
  },
});

export const { setMulti, resetMulti, setHandler } = App.actions;
export default App.reducer;
