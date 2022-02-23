import { combineReducers } from "redux";
import authReducer from "./authReducer";
import mediaReducer from "./mediaReducer";
import subscriberReducer from "./subscriberReducer";
import chatReducer from "./chatReducer";
import notificationsReducer from "./notificationsReducer";

export default combineReducers({
  authReducer,mediaReducer,subscriberReducer,chatReducer,notificationsReducer,
});

