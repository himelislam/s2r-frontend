import { actionTypes } from "./referrerActionTypes";

export const referrerReducer = (state, action) => {
    switch (action.type) {
      case actionTypes.SET_REFERRER:
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  };