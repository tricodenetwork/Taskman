import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import formReducer from "./slice-reducers/Formslice";
import dbreducer from "./slice-reducers/Database";
import userSlice from "./slice-reducers/userSlice";
// import { reducer as network } from "react-native-offline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActiveJob from "./slice-reducers/ActiveJob";
import ChatReducer from "./slice-reducers/ChatSlice";

// import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import { combineReducers } from "@reduxjs/toolkit";
import jobreducer from "./slice-reducers/JobSlice";
// import { useDispatch, useSelector } from 'react-redux'

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["ActiveJob"],
};
const middlewares = [
  /* other middlewares */
  thunk,
];

if (__DEV__) {
  const createDebugger = require("redux-flipper").default;
  middlewares.push(createDebugger());
}

const allReducers = combineReducers({
  app: formReducer,
  DB: dbreducer,
  Job: jobreducer,
  user: userSlice,
  ActiveJob: ActiveJob,
  Chat: ChatReducer,
});

// const persistedReducer = persistReducer(persistConfig, allReducers);

export const store = configureStore({
  reducer: allReducers,
  // reducer: persistedReducer,
  middleware: [...middlewares],
});
// export const persistor = persistStore(store);

// console.log(store.getState());
// console.log(names)
