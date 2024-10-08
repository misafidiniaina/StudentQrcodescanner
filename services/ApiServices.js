import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const EXPO_PUBLIC_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const EXPO_PUBLIC_API_PORT = process.env.EXPO_PUBLIC_API_PORT;
// Function to fetch data from API
export const fetchData = async (qrcodedata) => {
  try {
    const response = await axios.get(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants/qcode/${qrcodedata}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/auth/signin`,
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
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
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants`,
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
  parcours,
  niveau,
  matricule,
  anneeUniv,
  sexe, // Assuming you also want to include this field
  imageUri // The URI of the image to upload
) => {
  try {
    const accessToken = await getAccessToken();

    // Determine the file extension and MIME type
    const fileType = imageUri.split(".").pop().toLowerCase();
    let mimeType = "image/jpeg"; // Default to jpeg

    if (fileType === "png") {
      mimeType = "image/png";
    } else if (fileType === "jpg" || fileType === "jpeg") {
      mimeType = "image/jpeg";
    }

    // Create a FormData object
    const formData = new FormData();

    // Append the student data as a JSON string
    formData.append(
      "etudiant",
      JSON.stringify({
        nom,
        prenom,
        dob,
        cin,
        cin_date,
        tel,
        email,
        adresse,
        parcours,
        niveau,
        matricule,
        anneeUniv,
        sexe,
      })
    );

    // Append the image file
    formData.append("image", {
      uri: imageUri,
      type: mimeType, // Adjust type based on the image (jpeg or png)
      name: imageUri.split("/").pop(), // Extract the file name from the URI
    });

    // Send the POST request
    const response = await axios.post(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
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

export const updateEtudiant = async (id, etudiantData) => {
  try {
    const access_token = await getAccessToken();
    const response = await axios.put(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants/${id}`,
      etudiantData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudentProfilePicture = async (id, imageUri, token) => {
  try {
    const access_token = await getAccessToken();

    const fileType = imageUri.split(".").pop().toLowerCase();
    let mimeType = "image/jpeg"; // Default to jpeg

    if (fileType === "png") {
      mimeType = "image/png";
    } else if (fileType === "jpg" || fileType === "jpeg") {
      mimeType = "image/jpeg";
    }

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: imageUri.split("/").pop(), // Extract file name from path
      type: mimeType, // or 'image/jpg' based on the image format
    });

    // Make the PUT request using axios
    const response = await axios.put(
      `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}/etudiants/${id}/pdp`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
