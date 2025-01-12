import { createContext, useReducer } from "react";
import { initialReferrerState } from "./referrerInitialState";
import { referrerReducer } from "./referrerReducer";

const ReferrerContext = createContext();

export const ReferrerProvider = ({ children }) => {
  const [referrerState, dispatch] = useReducer(referrerReducer, initialReferrerState);

  return (
    <ReferrerContext.Provider value={{ referrerState, dispatch }}>
      {children}
    </ReferrerContext.Provider>
  );
};

export default ReferrerContext;