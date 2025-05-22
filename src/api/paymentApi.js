import { useUser } from "@/context/usercontext";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/payment`;
// const user = JSON.parse(localStorage.getItem('user'))


const getPlans = async () => {
     const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.get(`${API_URL}/plans`, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });
    return response.data;
};

const getBusinessSubscription = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'))

    const response = await axios.post(`${API_URL}/subscription`, data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });
    return response.data;
};

const createCheckoutSession = async (data) => {
     const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(`${API_URL}/create-checkout-session`, data, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });
    return response.data;
};

const handlePaymentSuccess = async (sessionId) => {
     const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.get(`${API_URL}/success?session_id=${sessionId}`, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });
    return response.data;
};

const cancelSubscription = async () => {
     const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(`${API_URL}/cancel-subscription`, {}, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });
    return response.data;
};

const getUsage = async () => {
     const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.get(`${API_URL}/usage`, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });
    return response.data;
};


const paymentApi = {
    getPlans,
    getBusinessSubscription,
    createCheckoutSession,
    handlePaymentSuccess,
    cancelSubscription,
    getUsage
};

export default paymentApi;