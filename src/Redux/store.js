import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);


// import { createStore, applyMiddleware } from "redux";
// import combinedReducers from "./combined-reducers";
// import thunk from "redux-thunk";

// export default function configureStore(initialState) {
//   return createStore(combinedReducers, initialState, applyMiddleware(thunk));
// }