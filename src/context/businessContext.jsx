// import { createContext, useReducer, useContext } from "react";

// //initial State
// const initialBusinesssState = {
//     _id: '',
//     businessName: '',
//     name: '',
//     email: '',
//     businessEmail: '',
//     phone: '',
//     address: '',
//     __v: '',
//     qrCodes: [],
// }

// // actions types

// const actionTypes = {
//     SET_BUSINESS: 'SET_BUSINESS',
// }

// // Reducer function to handle state updates
// const businessReducer = (state, action) => {
//     switch (action.type) {
//         case actionTypes.SET_BUSINESS:
//             return {
//                 ...state,
//                 ...action.payload
//             };
//         default:
//             return state;
//     }
// };

// // Create Context
// const BusinessContext = createContext();

// // UserProvider component to wrap the app
// export const BusinessProvider = ({ children }) => {
//     const [businessState, dispatch] = useReducer(businessReducer, initialBusinesssState);

//     return (
//         <BusinessContext.Provider value={{ businessState, dispatch }}>
//             {children}
//         </BusinessContext.Provider>
//     );
// };

// // Custom hook for using businessContext
// export const useBusiness = () => {
//     const context = useContext(BusinessContext);
//     if (!context) {
//         throw new Error('useUser must be used within a UserProvider');
//     }
//     return context;
// };