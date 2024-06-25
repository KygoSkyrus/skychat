import { SHOW_CONFIRMATION_MODAL, HIDE_CONFIRMATION_MODAL, SHOW_USER_MODAL, SHOW_THEME_MODAL, SHOW_GROUP_MODAL, SHOW_ENTITY_INFO_MODAL, SHOW_EDIT_AVATAR_MODAL, SHOW_BLOCKED_CONNECTIONS_MODAL, SET_TOAST } from "./actionTypes";

export const setToast = (toastContent, isError) => ({
    type: SET_TOAST,
    payload: { toastContent, isError },
});

export const showUserModal = (payload) => ({
    type: SHOW_USER_MODAL,
    payload,
});

export const showThemeModal = (payload) => ({
    type: SHOW_THEME_MODAL,
    payload,
});

export const showEditAvatarModal = (payload) => ({
    type: SHOW_EDIT_AVATAR_MODAL,
    payload,
});

export const showGroupModal = (payload) => ({
    type: SHOW_GROUP_MODAL,
    payload,
});

export const showEntityModal = (payload) => ({
    type: SHOW_ENTITY_INFO_MODAL,
    payload,
});

export const showBlockedConnectionsModal = (payload) => ({
    type: SHOW_BLOCKED_CONNECTIONS_MODAL,
    payload,
});

export const showConfirmationModal = (confirmationText, onConfirm) => ({
    type: SHOW_CONFIRMATION_MODAL,
    payload: { confirmationText, onConfirm },
});

export const hideConfirmationModal = () => ({
    type: HIDE_CONFIRMATION_MODAL,
});