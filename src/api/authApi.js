import { useUser } from "@/contexts/usercontext";
import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";
const user = JSON.parse(localStorage.getItem('user'))


//Signup user
const signup = async (userData, dispatch) => {
  // const { dispatch } = useUser();
  const response = await axios.post(API_URL + '/signup', userData);

  if (response.data) {
    sessionStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("user", JSON.stringify(response.data));

    dispatch({
      type: 'SET_USER',
      payload: response.data
    })
  }
  return response.data;
};

//Logout user
const logout = async (dispatch) => {
  const res = await axios.post(API_URL + "/logout", {
    withCredentials: true,
  });
  if (res.status === 200) {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    sessionStorage.removeItem("business");
    localStorage.removeItem("business");
    sessionStorage.removeItem("referrer");
    localStorage.removeItem("referrer");

    dispatch({
      type: 'LOGOUT',
    })
  }
};

//Login user
const login = async (userData, dispatch) => {
  const response = await axios.post(API_URL + "/login", userData);

  if (response.data) {
    sessionStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("user", JSON.stringify(response.data));

    dispatch({
      type: 'SET_USER',
      payload: response.data
    })
  }
  return response.data;
};

const forgetPassword = async (email) => {
  const response = await axios.post(API_URL + '/forget-password', email);

  if(response.data){
    console.log(response, "forget password successfull");
  }

  return response.data;
}

const resetPassword = async (newPassWithToken) => {
  const response = await axios.post(API_URL + '/reset-password', newPassWithToken);

  if(response.data){
    console.log(response.data, "reset password successfull");
  }

  return response.data;
}

const authApi = {
  signup,
  logout,
  login,
  forgetPassword,
  resetPassword
};

export default authApi;