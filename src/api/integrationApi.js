import { useUser } from "@/context/usercontext";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/integration`;
const user = JSON.parse(localStorage.getItem('user'))


//Save Zapier Webhook URL
const saveZapierURL = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))

    const response = await axios.post(API_URL + "/saveZapierURL", data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response.data;
};

//Test Zapier Webhook URL
const testZapierURL = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))

    const response = await axios.post(API_URL + "/testZapierURL", data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response.data;
};




//Save Pabbly Webhook URL
const savePabblyURL = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))

    const response = await axios.post(API_URL + "/savePabblyURL", data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response.data;
};

//Test Pabbly Webhook URL
const testPabblyURL = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))

    const response = await axios.post(API_URL + "/testPabblyURL", data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response.data;
};

const integrationApi = {
    saveZapierURL,
    testZapierURL,
    savePabblyURL,
    testPabblyURL
};

export default integrationApi;