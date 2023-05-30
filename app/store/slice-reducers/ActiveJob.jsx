import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  matNo: "",
  dept: "",
  handler: "",
  tasks: [{ handler: "", status: "Pending", name: "", duration: "" }],
  currenttask: "",
  job: "",
  email: "",
  supervisor: "",
};

const ActiveJob = createSlice({
  name: "ActiveJob",
  initialState,

  reducers: {
    setMatNo: (state, action) => {
      state.matNo = action.payload;
    },
    setDept: (state, action) => {
      state.dept = action.payload;
    },
    setHandler: (state, action) => {
      state.handler = action.payload;
      return state;
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
      state.currenttask = action.payload || "";
      return state;
    },
    Replace: (state, action) => {
      if (action.payload) {
        const result = JSON.parse(JSON.stringify(action.payload));
        return result;
      } else {
        return initialState;
      }
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
  Replace,
} = ActiveJob.actions;

export default ActiveJob.reducer;
