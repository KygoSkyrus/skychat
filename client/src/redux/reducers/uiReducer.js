import { SET_SIDEBAR, RESET_USERS_LIST } from "./../actionTypes";

const initialState = {
  sidebar: false,
  resetUserSearchList: false,
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SIDEBAR: {
      return {
        ...state,
        sidebar: action.payload,
      };
    }
    case RESET_USERS_LIST: {
      return {
        ...state,
        resetUserSearchList: action.payload
      }
    }

    default:
      return state;
  }
};

