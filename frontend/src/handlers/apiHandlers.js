import axios from "axios";

const API_BASE_URL = "https://quizapp-backend-gold.vercel.app/api";

export const fetchAllQuestions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};

export const fetchSet = async (setCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/set/${setCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching set ${setCode}:`, error);
        throw error;
    }
};

export const uploadQuestions = async (questions) => {
    try {
        await axios.post(`${API_BASE_URL}/upload`, { questions });
    } catch (error) {
        console.error("Error uploading questions:", error);
        throw error;
    }
};

export const fetchRecommendations = async (studiedSets, favorites) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recommendations`, {
            params: {
                studiedSets: studiedSets.join(","),
                favorites: favorites.join(","),
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw error;
    }
};