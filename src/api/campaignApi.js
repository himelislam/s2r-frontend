import axios from "axios";

// const API_URL = "http://localhost:4000/api/business";
const API_URL = `${import.meta.env.VITE_API_URL}/api/campaign`
const user = JSON.parse(localStorage.getItem('user'))

const createCampaign = async (campaignData) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + "/createCampaign", campaignData, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response.data;
}

const getCampaignsByBusinessId = async (businessId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await axios.post(API_URL + `/getCampaignsByBusinessId`, { businessId }, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response.data;
}

const updateCampaignActiveStatus = async (campaignId, activeStatus) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await axios.post(API_URL + `/updateCampaignActiveStatus`, { campaignId, activeStatus }, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response.data;
}

const uploadImage = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))

    const response = await axios.post(API_URL + '/upload', data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const getCampaignState = async (campaignId) => {
    const user = JSON.parse(localStorage.getItem('user'))

    const response = await axios.post(API_URL + '/getCampaignState', campaignId, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const updateCampaignState = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))

    const response = await axios.post(API_URL + '/updateCampaignState', data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })
    
    return response.data;
}

const campaignApi = {
    createCampaign,
    getCampaignsByBusinessId,
    updateCampaignActiveStatus,
    uploadImage,
    updateCampaignState,
    getCampaignState
};

export default campaignApi;