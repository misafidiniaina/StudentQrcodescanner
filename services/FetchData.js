import axios from "axios";

const EXPO_PUBLIC_API_BASE_URL=process.env.EXPO_PUBLIC_API_BASE_URL;
const EXPO_PUBLIC_API_PORT=process.env.EXPO_PUBLIC_API_PORT
// Function to fetch data from API
export const fetchData = async (qrcodedata) => {
  try {
    const response = await axios.get(`${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants/qrcode/${qrcodedata}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
