import { combineReducers } from 'redux';

import authReducer from './authReducer';
import sideBarReducer from './sideBarReducer';
import notificationsReducer from './notificationsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  sideBar: sideBarReducer,
  notifications: notificationsReducer
});

export default rootReducer;
