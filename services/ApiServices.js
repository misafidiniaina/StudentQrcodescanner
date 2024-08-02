import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const EXPO_PUBLIC_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const EXPO_PUBLIC_API_PORT = process.env.EXPO_PUBLIC_API_PORT;
// Function to fetch data from API
export const fetchData = async (qrcodedata) => {
  try {
    const response = await axios.get(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants/qrcode/${qrcodedata}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/token`,
      {
        grant_type: "password",
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("access_token");
    return accessToken;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

export const getEtudiants = async () => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      console.error("Access token not found");
      return;
    }

    const response = await axios.get(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants?skip=0&limit=100`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const convertImageToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting image to Base64: ", error);
    throw error;
  }
};

export const addEtudiant = async (
  nom,
  prenom,
  dob,
  cin,
  cin_date,
  tel,
  email,
  adresse,
  niveau,
  parcours,
  matricule,
  annee_univ,
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants/`,
      {
        nom,
        prenom,
        dob,
        cin,
        cin_date,
        tel,
        email,
        adresse,
        niveau,
        parcours,
        matricule,
        annee_univ,
      },
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEtudiant = async (idEtudiant) => {
  try {
    const access_token = await getAccessToken();
    const response = await axios.delete(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants/${idEtudiant}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
