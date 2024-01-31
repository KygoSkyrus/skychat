import { SET_FIREBASE_APP } from "./../actionTypes";

const initialState = {
  firebaseApp: null,
};

export const firebaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FIREBASE_APP: {
      return {
        ...state,
        firebaseApp: action.payload,
      };
    }

    default:
      return state;
  }
};

