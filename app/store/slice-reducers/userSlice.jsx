import { Realm } from "@realm/react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: Realm.BSON.ObjectId(),
  name: "",
  phone: "",
  dept: "",
  role: "",
  email: "",
  password: "",
  category: "",
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
