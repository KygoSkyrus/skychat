import { SET_CURRENT_USER } from "./../actionTypes";
import { SET_USER_INFO } from "./../actionTypes";

const initialState = {
  currentUser: null,
  userInfo: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.payload,
      };
    }
    case SET_USER_INFO: {
      return {
        ...state,
        userInfo: action.payload
      }
    }

    default:
      return state;
  }
};

