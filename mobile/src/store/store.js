import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./slice-reducers/Formslice";
import web3reducer from "./slice-reducers/Web3slice";

// import storage from "redux-persist/lib/storage";
// import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import { combineReducers } from "@reduxjs/toolkit";
import audioreducer from "./slice-reducers/AudioSlice";
// import { useDispatch, useSelector } from 'react-redux'

// const persistConfig = {
//   key: "root",
//   storage,
// };

const allReducers = combineReducers({
  form: formReducer,
  Web3: web3reducer,
  audio: audioreducer,
});

// const persistedReducer = persistReducer(persistConfig, allReducers);

export const store = configureStore({
  reducer: allReducers,
  middleware: [thunk],
});
// export const persistor = persistStore(store);

// console.log(store.getState());
// console.log(names)
