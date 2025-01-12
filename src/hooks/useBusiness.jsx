import BusinessContext from "@/context/business/BusinessContext";
import { useContext } from "react";

const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) {
      throw new Error('useBusiness must be used within a BusinessProvider');
    }
    return context;
  };
  
  export default useBusiness;