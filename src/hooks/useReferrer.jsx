import ReferrerContext from "@/context/referrer/ReferrerContext";
import { useContext } from "react";

const useReferrer = () => {
    const context = useContext(ReferrerContext);
    if (!context) {
      throw new Error('useReferrer must be used within a ReferrerProvider');
    }
    return context;
  };
  
  export default useReferrer;