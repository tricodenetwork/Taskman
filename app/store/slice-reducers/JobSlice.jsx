import { createSlice } from "@reduxjs/toolkit";
import { category } from "../../components/data";

const initialState = {
  name: "",
  no: 0,
  duration: "",
  category: "",
  id: "",
  tasks: [],
};

const JobSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
    setNo(state, action) {
      state.no = action.payload;
    },
    setDuration(state, action) {
      state.duration = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setId(state, action) {
      state.id = action.payload;
    },
    setTask(state, action) {
      state.tasks.push(action.payload);
    },
    replaceTask(state, action) {
      state.tasks = action.payload;
    },
  },
});

export const {
  setName,
  setNo,
  setDuration,
  replaceTask,
  setCategory,
  setId,
  setTask,
} = JobSlice.actions;
export default JobSlice.reducer;
