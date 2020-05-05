import * as types from './actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const setInitialNotifications = (notifications) => (dispatch) => {
  dispatch({
    type: types.INITIAL_NOTIFICATIONS,
    notifications
  });
};
