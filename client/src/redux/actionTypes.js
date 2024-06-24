//Actions
export const SET_FIREBASE_APP = "SET/FIREBASE_APP";

// user actions
export const SET_CURRENT_USER = "SET/CURRENT_USER";
export const SET_USER_INFO = "SET/USER_INFO";
export const SET_USERS_LIST = "SET/USERS_LIST";
export const SET_REQUEST_LIST = "SET/REQUEST_LIST";
export const SET_THEME = "SET/THEME";

// toast actions
export const SET_TOAST = "SET/TOAST";
export const RESET_TOAST = "RESET/TOAST";

// UI actions
export const SET_SIDEBAR = "SET/SIDEBAR";
export const RESET_USERS_LIST = "RESET/USERS_LIST";
export const SHOW_CONFIRMATION_MODAL = "SHOW/CONFIRMATION_MODAL";
export const HIDE_CONFIRMATION_MODAL = "HIDE/CONFIRMATION_MODAL";

// we have avoided using action creators, direct type and payload are dispatched from components
// only following action creators are used for confirmation modal
export const showConfirmationModal = (onConfirm) => ({
    type: SHOW_CONFIRMATION_MODAL,
    payload: onConfirm,
});

export const hideConfirmationModal = () => ({
    type: HIDE_CONFIRMATION_MODAL,
});