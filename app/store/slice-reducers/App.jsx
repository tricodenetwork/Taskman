import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  multipleJobs: [],
  refresh:1
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
    setRefresh(state,action) {
      state.refresh>10? state.refresh=0:state.refresh = state.refresh+1;
    },
  },
});

export const { setMulti, resetMulti,setRefresh } = App.actions;
export default App.reducer;
