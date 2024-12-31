import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/member`
const user = JSON.parse(localStorage.getItem('user'))


const getMembersByBusinessId = async ( businessId ) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await axios.post(API_URL + "/getMembersByBusinessId", { businessId }, {
        headers : {
            Authorization : `Bearer ${user?.token}`
        }
    })

    return response.data;
}

const memberApi = {
    getMembersByBusinessId
};

export default memberApi;