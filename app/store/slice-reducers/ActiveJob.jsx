import { createSlice } from "@reduxjs/toolkit";
import Realm from "realm";
import { category } from "../../models/Task";

const initialState = {
  id: "",
  matno: "",
  password: "",
  handler: "",
  currenttask: "",
  job: "",
  category: "",
  tasks: [],
  email: "",
  supervisor: "",
};

const ActiveJob = createSlice({
  name: "ActiveJob",
  initialState,

  reducers: {
    setMatNo: (state, action) => {
      state.matno = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setHandler: (state, action) => {
      state.handler = action.payload;
      return state;
    },
    setJob: (state, action) => {
      state.job = action.payload.name;
      state.category = action.payload.category.name;
      // state.job._id = new Realm.BSON.ObjectId();
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setSupervisor: (state, action) => {
      state.supervisor = action.payload;
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
  setPassword,
  setHandler,
  setJob,
  setEmail,
  setSupervisor,
  setTasks,
  setCurrentTask,
  Replace,
} = ActiveJob.actions;

export default ActiveJob.reducer;
