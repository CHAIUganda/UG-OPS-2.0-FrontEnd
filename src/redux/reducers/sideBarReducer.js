import * as types from '../actions/actionTypes';
import initialState from './initialState';

const sideBarReducer = (state = initialState.sideBar, action) => {
  switch (action.type) {
  case types.CHANGE_SECTION:
    return {
      ...state,
      ...action.sideBar
    };

  case types.CHANGE_ACTIVE:
    return {
      ...state,
      ...action.sideBar
    };

  default:
    return state;
  }
};

export default sideBarReducer;
