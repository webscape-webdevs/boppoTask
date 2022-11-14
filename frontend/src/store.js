import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import sessionSlice from "./slices/sessionSlice";
import userListSlice from "./slices/userListSlice";

const middleware = [thunk];

const store = configureStore(
 { reducer: {
  sessionSlice: sessionSlice,
  userListSlice: userListSlice,
  }},
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;


