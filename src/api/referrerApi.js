import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/referrer`
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

const getReferrersByBusinessId = async (businessId) => {
    const response = await axios.post(API_URL + "/getReferrersByBusinessId", { businessId }, {
        headers : {
            Authorization : `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const getReferrerById = async (referrerId) => {
    const response = await axios.post(API_URL + '/getReferrerById', {referrerId}, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const referrerApi = {
    createReferrer,
    getReferrersByBusinessId,
    getReferrerById
};

export default referrerApi;