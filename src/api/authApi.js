import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

//Signup user
const signup = async (userData) => {
  const response = await axios.post(API_URL + '/signup', userData);

  if (response.data) {
    sessionStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

//Logout user
const logout = async () => {
  const res = await axios.post(API_URL + "/logout", {
    withCredentials: true,
  });
  if (res.status === 200) {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
  }
};

//Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "/login", userData);

  if (response.data) {
    sessionStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const authApi = {
  signup,
  logout,
  login,
};

export default authApi;