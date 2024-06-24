import { SET_SIDEBAR, RESET_USERS_LIST, SHOW_CONFIRMATION_MODAL, HIDE_CONFIRMATION_MODAL } from "./../actionTypes";

const initialState = {
  sidebar: false,
  resetUserSearchList: false,
  isConfirmationModalVisible: false,
  onConfirm: null,
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
    case SHOW_CONFIRMATION_MODAL: {
      console.log('SHOW_CONFIRMATION_MODAL',action.payload)
      return {
        ...state,
        isConfirmationModalVisible: true,
        onConfirm: action.payload,
      }
    }
    case HIDE_CONFIRMATION_MODAL: {
      return {
        ...state,
        isConfirmationModalVisible: false,
        onConfirm: null,
      }
    }

    default:
      return state;
  }
};

