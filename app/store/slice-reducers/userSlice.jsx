import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  phone: "",
  dept: "",
  role: "",
  email: " ",
  password: " ",
  category: { name: "" },
};

const userSlice = createSlice({
  name: "names",
  initialState,
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setDept(state, action) {
      state.dept = action.payload;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setId(state, action) {
      state.id = action.payload;
    },
    setUser(state, action) {
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.dept = action.payload.dept;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.id = action.payload._id;
    },
  },
});

export const {
  setName,
  setRole,
  setDept,
  setPhone,
  setEmail,
  setPassword,
  setId,
  setUser,
  setCategory,
} = userSlice.actions;

export default userSlice.reducer;
