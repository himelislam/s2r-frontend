import { actionTypes } from "./businessActionTypes";


export const businessReducer = (state, action) => {
    switch (action.type) {
      case actionTypes.SET_BUSINESS:
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  };