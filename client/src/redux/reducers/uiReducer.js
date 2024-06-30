import { SHOW_LOADER, RESET_USERS_LIST, SHOW_CONFIRMATION_MODAL, HIDE_CONFIRMATION_MODAL, SHOW_USER_MODAL, SHOW_THEME_MODAL, SHOW_GROUP_MODAL, SHOW_ENTITY_INFO_MODAL, SHOW_EDIT_AVATAR_MODAL, SHOW_BLOCKED_CONNECTIONS_MODAL, SHOW_ADD_MEMBER_MODAL, SHOW_SIDEBAR } from "./../actionTypes";

const initialState = {
  isLoaderVisible: false,
  isSidebarVisible: false,
  resetUserSearchList: false,
  onConfirm: null,
  confirmationText: '',
  isConfirmationModalVisible: false,
  isUserModalVisible: false,
  isThemeModalVisible: false,
  isGroupModalVisible: false,
  isAddMemberModalVisible: false,
  isEntityInfoModalVisible: false,
  isEditAvatarModalVisible: false,
  isBlockedConnectionsModalVisible: false,
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADER: {
      return {
        ...state,
        isLoaderVisible: action.payload,
      };
    }

    case SHOW_SIDEBAR: {
      return {
        ...state,
        isSidebarVisible: action.payload,
      };
    }

    case RESET_USERS_LIST: {
      return {
        ...state,
        resetUserSearchList: action.payload
      }
    }

    case SHOW_CONFIRMATION_MODAL: {
      return {
        ...state,
        isConfirmationModalVisible: true,
        onConfirm: action.payload.onConfirm,
        confirmationText: action.payload.confirmationText,
      }
    }

    case HIDE_CONFIRMATION_MODAL: {
      return {
        ...state,
        isConfirmationModalVisible: false,
        onConfirm: null,
      }
    }

    case SHOW_USER_MODAL: {
      return {
        ...state,
        isUserModalVisible: action.payload,
      }
    }

    case SHOW_THEME_MODAL: {
      return {
        ...state,
        isThemeModalVisible: action.payload,
      }
    }

    case SHOW_GROUP_MODAL: {
      return {
        ...state,
        isGroupModalVisible: action.payload,
      }
    }

    case SHOW_ADD_MEMBER_MODAL: {
      return {
        ...state,
        isAddMemberModalVisible: action.payload,
      }
    }

    case SHOW_ENTITY_INFO_MODAL: {
      return {
        ...state,
        isEntityInfoModalVisible: action.payload,
      }
    }

    case SHOW_EDIT_AVATAR_MODAL: {
      return {
        ...state,
        isEditAvatarModalVisible: action.payload,
      }
    }

    case SHOW_BLOCKED_CONNECTIONS_MODAL: {
      return {
        ...state,
        isBlockedConnectionsModalVisible: action.payload,
      }
    }

    default:
      return state;
  }
};

