import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  jobs: [],
  activeJobs: [],
};

const AdminSlice = createSlice({
  name: "Admin",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addJob: (state, action) => {
      state.jobs.push(action.payload);
    },
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    removeJob: (state, action) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload);
    },
    setActiveJobs: (state, action) => {
      state.activeJobs.push(action.payload);
    },
  },
});

export const {
  addUser,
  removeUser,
  addJob,
  removeJob,
  setActiveJobs,
  setJobs,
  setUsers,
} = AdminSlice.actions;

export default AdminSlice.reducer;
