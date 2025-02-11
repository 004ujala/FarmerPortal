import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const getPrediction = (data) => {
    return axios.post(`${API_URL}/predict_yield`, data);
};

const getRecommendation = (data) => {
    return axios.post(`${API_URL}/recommend_crop`, data);
};

const cropService = {
    getPrediction,
    getRecommendation,
};

export default cropService;
