import axios from "axios";

const API_URL = "http://localhost:4000/api/user";
const user = JSON.parse(localStorage.getItem('user'))


const createBusiness = async (userData) => {
    const response = await axios.post(API_URL + "/createBusiness", userData, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });

    if (response.data) {
        sessionStorage.setItem("business", JSON.stringify(response?.data));
        localStorage.setItem("business", JSON.stringify(response?.data));
    }
    return response.data;
}

const createReferrer = async (userData) => {
    const response = await axios.post(API_URL + "/createReferrer", userData, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    })

    if(response.data){
        sessionStorage.setItem("referrer", JSON.stringify(response?.data));
        localStorage.setItem("referrer", JSON.stringify(response?.data));
    }
    return response.data;
}

const userApi = {
    createBusiness,
    createReferrer
};

export default userApi;