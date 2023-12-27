import { UPDATE_USER_INFO } from "./../actionTypes";

const initialState = {
  userData: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_INFO:{
console.log('action--',action)
      return {
        ...state,
        userData: action.payload,
      };
    }

    default:
      return state;
  }
};

