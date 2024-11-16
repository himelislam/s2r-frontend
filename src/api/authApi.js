import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";
const user = JSON.parse(localStorage.getItem('user'))

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
    sessionStorage.removeItem("business");
    localStorage.removeItem("business");
    sessionStorage.removeItem("referrer");
    localStorage.removeItem("referrer");
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

const createBusiness = async(userData) => {
  const response = await axios.post(API_URL + "/createBusiness", userData, {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

  if (response.data) {
    sessionStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
}

const authApi = {
  signup,
  logout,
  login,
  createBusiness
};

export default authApi;