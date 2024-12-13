import axios from "axios";

// const API_URL = "http://localhost:4000/api/business";
const API_URL = `${import.meta.env.VITE_API_URL}/api/referee`
const user = JSON.parse(localStorage.getItem('user'))

const createReferee = async (refereeData) => {
    const response = await axios.post(API_URL + '/createReferee', refereeData)

    if(response.data){
        console.log(response.data, "created referee");
    }

    return response.data;
}

const refereeApi = {
    createReferee
};

export default refereeApi;