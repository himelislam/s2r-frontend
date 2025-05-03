import axios from "axios";

// const API_URL = "http://localhost:4000/api/business";
const API_URL = `${import.meta.env.VITE_API_URL}/api/referee`
const user = JSON.parse(localStorage.getItem('user'))

const createReferee = async (refereeData) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + '/createReferee', refereeData)
    
    if(response.data){
        console.log(response.data, "created referee");
    }
    
    return response.data;
}

const getRefereeByReferrerId = async (referrerId) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + '/getRefereeByReferrerId', { referrerId }, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })
    
    return response.data;
}

const getRefereeBusinessById = async (businessId) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + '/getRefereeByBusinessId', { businessId }, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const getRefeeeList = async (refereerId) => {
    const response = await axios.post(API_URL + '/getRefereeList', { refereerId })

    return response.data;
}

const updateRefereeStatus = async ({refereeId, status}) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + '/updateRefereeStatus', { refereeId, status }, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })
    return response.data;
}

const getRefereeWithCampaignDetails = async (businessId) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + '/getRefereeWithCampaignDetails', { businessId }, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })
    
    return response.data;
}

const sendRewardEmailToRefereer = async(data) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post (API_URL + '/sendRewardEmailToRefereer', data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    } )

    return response.data;
}

const refereeApi = {
    createReferee,
    getRefeeeList,
    getRefereeBusinessById,
    getRefereeByReferrerId,
    updateRefereeStatus,
    getRefereeWithCampaignDetails,
    sendRewardEmailToRefereer
};

export default refereeApi;