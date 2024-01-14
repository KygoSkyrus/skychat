import { SET_CURRENT_USER, SET_USERS_LIST } from "./../actionTypes";
import { SET_USER_INFO } from "./../actionTypes";

const initialState = {
  currentUser: null,
  userInfo: null,
  usersList: null,
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
    case SET_USERS_LIST: {
      return {
        ...state,
        usersList: action.payload
      }
    }

    default:
      return state;
  }
};

