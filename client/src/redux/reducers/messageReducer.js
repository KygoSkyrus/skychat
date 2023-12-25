import { ADD_ITEM, DELETE_ITEM,MESSAGE } from "./../actionTypes";

const initialState = {
  numOfMessages: 0,
};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE:
      return {
        ...state,
        numOfMessages: state.numOfMessages + 1,
      };

    case DELETE_ITEM:{
      return {
        ...state,
        numOfMessages: state.numOfMessages - 1,
      };}
    default:
      return state;
  }
};

