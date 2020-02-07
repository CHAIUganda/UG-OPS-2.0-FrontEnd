// prettier-ignore
import * as types from '../actions/actionTypes';
import initialState from './initialState';


const authReducer = (state = initialState.user, action) => {
  switch (action.type) {
  case types.LOGIN:
    return {
      ...action.user
    };

  case types.LOGOUT:
    return {
      ...action.user,
      email: '',
      token: '',
      gender: '',
      internationalStaff: undefined,
      department: '',
      firstName: '',
      lastName: '',
      Position: ''
    };

  default:
    return state;
  }
};

export default authReducer;
