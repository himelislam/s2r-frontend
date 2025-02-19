import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL}/api/business`
const user = JSON.parse(localStorage.getItem('user'))

const createBusiness = async (userData) => {
    const user = JSON.parse(localStorage.getItem('user'))
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

const addReferrer = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + "/addReferrer", data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response.data;
}

const getAllBusiness = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.get(API_URL + "/getAllBusiness", {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const generateQrCodes = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + '/generateQrCodes', data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        },
        // responseType: 'blob',// Interpret response as a Blob
    })

    return response.data;
}

const getBusinessById = async (businessId) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + '/getBusinessById', { businessId }, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const inviteReferrer = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + '/inviteReferrer', data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const updateProfile = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await axios.post(API_URL + '/updateProfile', data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    if (response) {
        user.name = response.data.name,
            user.email = response.data.email,
            user.url = response.data.url,
            localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
}

const updateBusinessProfile = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await axios.post(API_URL + '/updateBusinessProfile', data, {
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

const businessApi = {
    createBusiness,
    addReferrer,
    getAllBusiness,
    generateQrCodes,
    getBusinessById,
    inviteReferrer,
    updateProfile,
    updateBusinessProfile,
    uploadImage
};

export default businessApi;