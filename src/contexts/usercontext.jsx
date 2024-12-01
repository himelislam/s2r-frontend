import { createContext, useReducer, useContext } from "react";

//initial State

const initialUserState = {
    name: '',
    email: '',
    token: '',
    userId: '',
    userType: '',
    _id: ''
}

// actions types

const actionTypes = {
    SET_USER: 'SET_USER',
    UPDATE_ROLE: 'UPDATE_ROLE',
    LOGOUT: 'LOGOUT',
}

// Reducer function to handle state updates
const userReducer = (state, action) => {
    switch (action.type) {
      case actionTypes.SET_USER:
        return { ...state, ...action.payload };
      case actionTypes.UPDATE_ROLE:
        return { ...state, userType: action.payload.userType, userId: action.payload.userId };
      case actionTypes.LOGOUT:
        return initialUserState;
      default:
        return state;
    }
  };

  // Create Context
const UserContext = createContext();

// UserProvider component to wrap the app
export const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, initialUserState);

  return (
    <UserContext.Provider value={{ userState, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};