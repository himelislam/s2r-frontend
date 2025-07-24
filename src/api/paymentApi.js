import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/payment`;

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    Authorization: `Bearer ${user?.token}`
  };
};

const getPlans = async () => {
  const response = await axios.get(`${API_URL}/plans`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

const getBusinessSubscription = async (data) => {
  const response = await axios.post(`${API_URL}/subscription`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

const createCheckoutSession = async (data) => {
  const response = await axios.post(`${API_URL}/create-checkout-session`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

const handlePaymentSuccess = async (sessionId) => {
  const response = await axios.post(`${API_URL}/success?session_id=${sessionId}`, "", {
    headers: getAuthHeaders()
  });
  return response.data;
};

const cancelSubscription = async (data) => {
  const response = await axios.post(`${API_URL}/cancel-subscription`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

const getUsage = async () => {
  const response = await axios.get(`${API_URL}/usage`, {
    headers: getAuthHeaders()
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
