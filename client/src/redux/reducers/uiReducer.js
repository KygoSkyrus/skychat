import { SET_SIDEBAR, RESET_USERS_LIST, SHOW_CONFIMATION_MODAL } from "./../actionTypes";

const initialState = {
  sidebar: false,
  resetUserSearchList: false,
  showConfirmationModal: false,
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SIDEBAR: {
      console.log('sety side bar', action)
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
    case SHOW_CONFIMATION_MODAL: {
      return {
        ...state,
        showConfirmationModal: action.payload
      }
    }

    default:
      return state;
  }
};

