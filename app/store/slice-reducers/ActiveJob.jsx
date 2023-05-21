import { createSlice } from "@reduxjs/toolkit";

const ActiveJob = createSlice({
  name: "ActiveJob",
  initialState: {
    id: "",
    matNo: "",
    dept: "",
    handler: "",
    tasks: [],
    currenttask: "",
    job: "",
    email: "",
    supervisor: "",
  },
  reducers: {
    setMatNo: (state, action) => {
      state.matNo = action.payload;
    },
    setDept: (state, action) => {
      state.dept = action.payload;
    },
    setHandler: (state, action) => {
      state.handler = action.payload;
    },
    setJob: (state, action) => {
      state.job = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setCurrentTask: (state, action) => {
      state.currenttask = action.payload;
    },
  },
});

export const {
  setMatNo,
  setDept,
  setHandler,
  setJob,
  setEmail,
  setId,
  setTasks,
  setCurrentTask,
} = ActiveJob.actions;

export default ActiveJob.reducer;
