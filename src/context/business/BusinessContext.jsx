import { createContext, useReducer } from "react";
import { businessReducer } from "./businessReducer";
import { initialBusinessState } from "./businessInitialState";

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businessState, dispatch] = useReducer(businessReducer, initialBusinessState);

  return (
    <BusinessContext.Provider value={{ businessState, dispatch }}>
      {children}
    </BusinessContext.Provider>
  );
};

export default BusinessContext;