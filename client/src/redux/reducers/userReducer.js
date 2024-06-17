import { SET_CURRENT_USER, SET_USERS_LIST, SET_USER_INFO, SET_REQUEST_LIST, SET_THEME } from "./../actionTypes";

const initialState = {
  currentUser: null,
  userInfo: null,
  usersList: null,
  requestList: null,
  theme: null,
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
    case SET_REQUEST_LIST: {
      return {
        ...state,
        requestList: action.payload
      }
    }
    case SET_THEME: {
      return {
        ...state,
        theme: action.payload
      }
    }

    default:
      return state;
  }
};

