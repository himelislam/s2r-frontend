import axios from "axios";

// const API_URL = "http://localhost:4000/api/business";
const API_URL = `${import.meta.env.VITE_API_URL}/api/business`
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

const getAllBusiness = async () => {
    const response =  await axios.get(API_URL + "/getAllBusiness", {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const generateQrCodes = async (data) => {
    const response = await axios.post( API_URL + '/generateQrCodes', data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        },
        // responseType: 'blob',// Interpret response as a Blob
    })

    return response.data;
}

const getBusinessById = async (businessId) => {
    const response = await axios.post(API_URL + '/getBusinessById', { businessId }, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const businessApi = {
    createBusiness,
    getAllBusiness,
    generateQrCodes,
    getBusinessById
};

export default businessApi;