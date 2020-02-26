import * as types from './actionTypes';

export const changeSection = (section) => (dispatch) => {
  dispatch({
    type: types.CHANGE_SECTION,
    sideBar: {
      active: null,
      section
    }
  });
};

export const changeActive = (activeItem) => (dispatch) => {
  dispatch({
    type: types.CHANGE_ACTIVE,
    sideBar: {
      active: activeItem,
    }
  });
};
