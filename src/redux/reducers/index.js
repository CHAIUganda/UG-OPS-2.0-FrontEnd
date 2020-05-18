import { combineReducers } from 'redux';

import authReducer from './authReducer';
import sideBarReducer from './sideBarReducer';
import notificationsReducer from './notificationsReducer';
import subscriptionLockReducer from './subscriptionLockedReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  sideBar: sideBarReducer,
  notifications: notificationsReducer,
  subscriptionLock: subscriptionLockReducer
});

export default rootReducer;
