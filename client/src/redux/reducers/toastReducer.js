import { RESET_TOAST, SET_TOAST } from "../actionTypes";

const initialState = {
    toast: false,
    toastContent: "",
    isError: false,
};

export const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOAST: {
            return {
                ...state,
                toast: true,
                toastContent: action.payload.toastContent,
                isError: action.payload.isError,
            };
        }
        case RESET_TOAST: {
            return initialState;
        }

        default:
            return state;
    }
};