import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chat: [],
  //   { id: "", recipient: "", sender: "", messages: {} }
};

const ChatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    addChat: (state, action) => {
      state.chat.push(action.payload);
    },
    deleteChat: (state, action) => {
      const index = state.chat.findIndex((obj) => obj.id == action.payload.id);

      if (index !== -1) {
        state.chat.splice(index, 1);
      }
    },
    appendMessages: (state, action) => {
      state.messages.push(...action.payload);
    },
  },
});

export const { addChat, deleteChat } = ChatSlice.actions;

export default ChatSlice.reducer;
