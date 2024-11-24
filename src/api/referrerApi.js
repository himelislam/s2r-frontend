import axios from "axios";

const API_URL = "http://localhost:4000/api/referrer";
const user = JSON.parse(localStorage.getItem('user'))

const createReferrer = async (userData) => {
    const response = await axios.post(API_URL + "/createReferrer", userData, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    if(response.data){
        sessionStorage.setItem("referrer", JSON.stringify(response?.data));
        localStorage.setItem("referrer", JSON.stringify(response?.data));
    }
    return response.data;
}

const referrerApi = {
    createReferrer
};

export default referrerApi;