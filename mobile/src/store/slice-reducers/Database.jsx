import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  jobs: [],
};

const Database = createSlice({
  name: "DB",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setJobs(state, action) {
      state.jobs = action.payload;
    },
  },
});

export const { setUsers, setJobs } = Database.actions;
export default Database.reducer;
