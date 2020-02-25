import { combineReducers } from 'redux';

import authReducer from './authReducer';
import sideBarReducer from './sideBarReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  sideBar: sideBarReducer
});

export default rootReducer;
