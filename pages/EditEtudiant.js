import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";
import {
  updateEtudiant,
  updateStudentProfilePicture,
} from "../services/ApiServices";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  HelperText,
} from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import {
  colors,
  dateFormatting,
  formatCin,
  formatPhoneNumber,
  removeSpaces,
  transformDateToISO,
  capitalizeFirstLetter,
} from "../utils/Utils";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import profilePlaceholder from "../images/profile_placeholder.jpg";
import Loading from "../components/Loading";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const EXPO_PUBLIC_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const EXPO_PUBLIC_API_PORT = process.env.EXPO_PUBLIC_API_PORT;

const theme = {
  ...DefaultTheme,
  roundness: 10, // Set the desired border radius
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db", // Example primary color
  },
};

// Helper function to format date as DD/MM/YYYY
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to parse date from DD/MM/YYYY string
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to validate date
const isValidDate = (date) => !isNaN(date.getTime());

const EditEtudiant = ({ route }) => {
  const { student } = route.params;
  const navigation = useNavigation();

  const [matricule, setMatricule] = useState(student.matricule);
  const [nom, setNom] = useState(student.nom);
  const [prenom, setPrenom] = useState(student.prenom);
  const [dob, setDob] = useState(new Date(student.dob));
  const [niveau, setNiveau] = useState("L2");
  const [parcours, setParcours] = useState(student.parcours);
  const [email, setEmail] = useState(student.email);
  const [tel, setTel] = useState(formatPhoneNumber(student.tel));
  const [cin, setCin] = useState("");
  const [cin_date, setCin_date] = useState(new Date());
  const [adresse, setAdresse] = useState(student.adresse);
  const [anneeUniv, setAnneeUniv] = useState("2023-2024");
  const [sexe, setSexe] = useState(student.sexe);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCinDatePicker, setShowCinDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState(dateFormatting(student.dob));
  const [cinDateInput, setCinDateInput] = useState("");
  const [selectedValue, setSelectedValue] = useState(student.niveau);
  const [radioselectedValue, setRadioselectedValue] = useState(
    student.parcours
  );
  const [listType, setListType] = useState("lisence");
  const [imageUri, setImageUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [changePhoto, setChangePhoto] = useState(false);

  const textInputRef = useRef(null);
  const matriculeRef = useRef(null);
  const nomRef = useRef(null);

  useEffect(() => {
    if (student.cin_date) {
      setCin_date(new Date(student.cin_date));
      setCinDateInput(dateFormatting(student.cin_date));
    }
    if (student.cin) {
      setCin(formatCin(student.cin));
    }
    if (student.profilePicture) {
      setImageUri(
        `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}${student.profilePicture.path}`
      );
    }
    if (student.niveau === "M1" || student.niveau === "M2") {
      setListType("master");
    }
  }, [student]);

  const [matriculeError, setMatriculeError] = useState({
    hasError: false,
    display: "none",
  });
  const [nomError, setNomError] = useState({
    hasError: false,
    display: "none",
  });
  const [prenomError, setPrenomError] = useState({
    hasError: false,
    display: "none",
  });
  const [numeroError, setNumeroError] = useState({
    hasError: false,
    display: "none",
    message: "Veuillze entrer le numero de téléphone",
  });
  const [emailError, setEmailError] = useState({
    hasError: false,
    display: "none",
    message: "Veuillez entrer l'adresse email",
  });
  const [adresseError, setAdresseError] = useState({
    hasError: false,
    display: "none",
  });

  const [cinError, setCinError] = useState({
    hasError: false,
    display: "none",
    message: "Veuillez remplir le numéro CIN",
  });
  const [dobError, setDobError] = useState({
    hasError: false,
    display: "none",
    message: "Veuillez entrer la date de naissance",
  });
  const [cinDateError, setCinDateError] = useState({
    hasError: false,
    display: "none",
    message: "Veuillez entrer la date du carte d'identité",
  });
  const [parcourError, setParcourError] = useState({
    border: "black",
    display: "none",
    bdWidth: 1,
  });

  const lisenceOptions = [
    { label: "IG", value: "IG" },
    { label: "GB", value: "GB" },
    { label: "ASR", value: "ASR" },
  ];

  const masterOptions = [
    { label: "IG", value: "IG" },
    { label: "GB", value: "GB" },
    { label: "ASR", value: "ASR" },
    { label: "GID", value: "GID" },
    { label: "OCC", value: "OCC" },
  ];

  const options = listType === "lisence" ? lisenceOptions : masterOptions;

  const openImagePicker = async () => {
    // Show action sheet to choose between taking a photo or picking from gallery
    const { action } = await new Promise((resolve) => {
      Alert.alert(
        "Ajouter une photo",
        "Selectionner une action:",
        [
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => resolve({ action: "cancel" }),
          },

          {
            text: "Choisir depuis la galery",
            onPress: () => resolve({ action: "pickImage" }),
          },
          {
            text: "Prendre une photo",
            onPress: () => resolve({ action: "takePhoto" }),
          },
        ],
        { cancelable: true }
      );
    });

    if (action === "takePhoto") {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } else if (action === "pickImage") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    }
  };

  const RadioButton = ({ label, value, selected, onPress }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.radioButtonContainer}
        activeOpacity={0.9}
      >
        <Icon
          name={selected ? "radio-button-checked" : "radio-button-unchecked"}
          size={17}
          color={colors.primary}
        />
        <Text style={styles.radioButtonText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const handleUpdateEtudiant = async () => {
    const formattedTel = removeSpaces(tel);
    const formattedCin = removeSpaces(cin);
    const formattedDob = transformDateToISO(dob);
    let formattedDateCin = transformDateToISO(cin_date);

    if (!cin && formattedDateCin == transformDateToISO(new Date())) {
      formattedDateCin = null;
    }
    if (
      !nom ||
      !prenom ||
      !email ||
      !formattedTel ||
      formattedDob == transformDateToISO(new Date()) ||
      (formattedDateCin == transformDateToISO(new Date()) &&
        cin &&
        cin.length == 15) ||
      validateEmail(email) !== "" ||
      formattedTel.length < 10 ||
      !adresse ||
      (cin && cin.length < 15) ||
      !parcours
    ) {
      if (!matricule) {
        setMatriculeError({
          ...matriculeError,
          hasError: true,
          display: "block",
        });
      }
      if (!nom) {
        setNomError({ ...nomError, hasError: true, display: "block" });
      }
      if (!prenom) {
        setPrenomError({ ...prenomError, hasError: true, display: "block" });
      }
      if (validateEmail(email) !== "") {
        setEmailError({
          ...emailError,
          hasError: true,
          display: "block",
          message: validateEmail(email),
        });
      }
      if (!formattedTel) {
        setNumeroError({
          ...numeroError,
          hasError: true,
          display: "block",
          message: "Veuillez entrer le numéro de téléphone",
        });
      } else if (formattedTel.length < 10) {
        setNumeroError({
          ...numeroError,
          hasError: true,
          display: "block",
          message: "Veuillez entrer une numéro de 10 chiffres",
        });
      }
      if (!adresse) {
        setAdresseError({ ...adresseError, hasError: true, display: "block" });
      }
      if (formattedDob == transformDateToISO(new Date())) {
        setDobError({
          ...dobError,
          hasError: true,
          display: "block",
          message: "Veuillez entrer la date de naissance",
        });
      }
      if (cin && cin.length < 12) {
        setCinError({
          ...cinError,
          hasError: true,
          display: "block",
          message: "Veuillez entrer une numero CIN de 12 chiffres",
        });
      }
      if (!cin && formattedDateCin !== transformDateToISO(new Date())) {
        setCinError({
          ...cinError,
          hasError: true,
          display: "block",
          message: "Veuillez remplir le numero CIN",
        });
      }
      if (
        formattedDateCin == transformDateToISO(new Date()) &&
        cin &&
        cin.length == 15
      ) {
        setCinDateError({
          ...cinDateError,
          hasError: true,
          display: "block",
          message: "Veuillez entrer la date du carte d'identité",
        });
      }
      if (!parcours) {
        setParcourError({
          ...parcourError,
          border: "#ad0c0c",
          display: "block",
          bdWidth: 2,
        });
      }
      return;
    }

    setLoading(true);

    const actualValue = {
      id: student.id,
      nom: capitalizeFirstLetter(nom),
      prenom: capitalizeFirstLetter(prenom),
      dob: formattedDob,
      cin: formattedCin,
      cin_date: formattedDateCin,
      email: email,
      tel: formattedTel,
      matricule: matricule,
      adresse: adresse,
      parcours: parcours,
      anneeUniv: student.anneeUniv,
      niveau: niveau,
      sexe: sexe,
      qrCode: student.qrCode,
      profilePicture: student.profilePicture,
    };
    let changePhoto = true;
    const changes = {};
    for (const key in student) {
      if (student[key] !== actualValue[key]) {
        changes[key] = actualValue[key];
      }
    }

    if (imageUri.includes(student.profilePicture.path)) {
      changePhoto = false;
    }
    try {
      if (Object.keys(changes).length === 0 && !changePhoto) {
        Toast.show({
          type: "info",
          text1: "Modification réussie",
          text2: "Aucune information n'a été modifiée",
          text1Style: { fontSize: 17, marginVertical: 5 },
          text2Style: { fontSize: 12, marginVertical: 7 },
        });
        navigation.navigate("studentInfoPage", {
          isEditable: true,
          student: student,
        });
        return;
      }
      let serverResult = null;
      if (Object.keys(changes).length !== 0) {
        serverResult = await updateEtudiant(student.id, changes);
      }
      if (changePhoto) {
        serverResult = await updateStudentProfilePicture(student.id, imageUri);
      }
      Toast.show({
        type: "success",
        text1: "Modification réussie",
        text2: "La modification est bien enregistrée",
        text1Style: { fontSize: 17, marginVertical: 5 },
        text2Style: { fontSize: 12, marginVertical: 7 },
      });
      navigation.navigate("Dashboard", {
        added: null,
        updated: serverResult,
      });
      navigation.navigate("studentInfoPage", {
        isEditable: true,
        student: serverResult,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Modification echoué",
        text2: "Certains Information correspond déjà à d'autre étudiants",
        text1Style: { fontSize: 17, marginVertical: 5 },
        text2Style: { fontSize: 12, marginVertical: 7 },
      });
      setLoading(false);
      navigation.navigate("studentInfoPage", {
        isEditable: true,
        student: student,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelButton = () => {
    navigation.goBack();
  };

  const onChangeDob = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === "ios");
    setDob(currentDate);
    setDateInput(formatDate(currentDate)); // Update the date input field
  };

  const onChangeCinDate = (event, selectedDate) => {
    const currentDate = selectedDate || cin_date;
    setShowCinDatePicker(Platform.OS === "ios");
    setCin_date(currentDate);
    setCinDateInput(formatDate(currentDate)); // Update the date input field
  };

  const handleDateInputChange = (text, setInput, setDate) => {
    // Remove non-numeric characters except slashes
    const cleanedText = text.replace(/[^0-9]/g, "");

    // Limit input length
    if (cleanedText.length <= 8) {
      // Changed from 10 to 8 to handle case when user is typing
      // Format as DD/MM/YYYY
      let formattedText = cleanedText
        .replace(/(\d{2})(\d{1,2})/, "$1/$2") // Add slash after day
        .replace(/(\d{2}\/)(\d{2})(\d{1,4})/, "$1$2/$3") // Add slash after month
        .substring(0, 10); // Ensure length of 10

      setInput(formattedText);

      // Update date if the text input is valid
      if (formattedText.length === 10) {
        const parsedDate = parseDate(formattedText);
        if (isValidDate(parsedDate)) {
          setDate(parsedDate); // Update date state
        }
      }
    }
    if (cleanedText.length == 0) {
      setDate(new Date());
    }
  };

  const handleSelectionChange = (event) => {
    const { selection } = event.nativeEvent;
    let newSelection = { start: 0, end: 2 };

    if (selection.start >= 3 && selection.start <= 5) {
      newSelection = { start: 3, end: 5 };
    } else if (selection.start >= 6) {
      newSelection = { start: 6, end: 10 };
    }

    // Adjust cursor position
    if (textInputRef.current) {
      textInputRef.current.setNativeProps({
        selection: newSelection,
      });
    }
  };

  const handleNumInput = (text) => {
    let numericText = text.replace(/[^0-9]/g, "").slice(0, 10);

    let formattedText = numericText;
    if (numericText.length > 3) {
      formattedText = numericText.slice(0, 3) + " " + numericText.slice(3);
    }
    if (numericText.length > 5) {
      formattedText = formattedText.slice(0, 6) + " " + formattedText.slice(6);
    }
    if (numericText.length > 8) {
      formattedText =
        formattedText.slice(0, 10) + " " + formattedText.slice(10);
    }
    if (formattedText !== "" && formattedText.length == 13) {
      setNumeroError({ hasError: false, display: "none" });
    } else if (formattedText.length < 13 && formattedText !== "") {
      setNumeroError({
        hasError: true,
        display: "block",
        message: "Veuillez entrer un numéro de 10 chiffres",
      });
    } else if (formattedText == "") {
      setNumeroError({
        hasError: true,
        display: "block",
        message: "Veuillez entrer le numéro de téléphone",
      });
    }
    setTel(formattedText);
  };

  const handleCinInput = (text) => {
    let numericText = text.replace(/[^0-9]/g, "").slice(0, 12);

    // Format the text to "XXX XXX XXX XXX"
    let formattedText = numericText;
    if (numericText.length > 3) {
      formattedText = numericText.slice(0, 3) + " " + numericText.slice(3);
    }
    if (numericText.length > 6) {
      formattedText = formattedText.slice(0, 7) + " " + formattedText.slice(7);
    }
    if (numericText.length > 9) {
      formattedText =
        formattedText.slice(0, 11) + " " + formattedText.slice(11);
    }

    if (
      formattedText.length == 15 &&
      transformDateToISO(cin_date) !== transformDateToISO(new Date())
    ) {
      setCinError({ hasError: false, display: "none" });
      setCinDateError({ hasError: false, display: "none", message: "" });
    } else if (
      formattedText.length == 0 &&
      transformDateToISO(cin_date) !== transformDateToISO(new Date())
    ) {
      setCinError({
        hasError: true,
        display: "block",
        message: "Veuillez entrer le numero CIN",
      });
      setCinDateError({ hasError: false, display: "none", message: "" });
    } else if (
      formattedText.length == 0 &&
      transformDateToISO(cin_date) == transformDateToISO(new Date())
    ) {
      setCinError({
        hasError: false,
        display: "none",
        message: "",
      });
      setCinDateError({ hasError: false, display: "none", message: "" });
    } else if (
      formattedText.length !== 0 &&
      transformDateToISO(cin_date) == transformDateToISO(new Date())
    ) {
      setCinError({
        hasError: false,
        display: "none",
        message: "",
      });
      setCinDateError({ hasError: false, display: "none", message: "" });
    } else if (
      formattedText.length !== 0 &&
      transformDateToISO(cin_date) !== transformDateToISO(new Date())
    ) {
      setCinError({
        hasError: false,
        display: "none",
        message: "",
      });
      setCinDateError({ hasError: false, display: "none", message: "" });
    } else {
      if (
        transformDateToISO(cin_date) !== transformDateToISO(new Date()) &&
        formattedText.length !== 0
      ) {
        setCinError({
          hasError: false,
          display: "none",
          message: "",
        });
      } else {
        setCinError({
          hasError: true,
          display: "block",
          message: "Veuillez entrer le numero CIN",
        });
      }
    }
    setCin(formattedText);
  };

  const validateEmail = (email) => {
    const allowedChars = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      return "Veuillez entrer votre adresse email.";
    } else if (!regex.test(email)) {
      if (!allowedChars.test(email.replace(/@/, ""))) {
        return "L'email contient des caractères non autorisés.";
      } else {
        const atCount = (email.match(/@/g) || []).length;
        if (atCount !== 1) {
          return "L'email doit contenir un symbole '@'.";
        }
        const [localPart, domainPart] = email.split("@");
        if (!domainPart.includes(".")) {
          return "Le domaine doit contenir un point '.' pour être valide.";
        }
        if (domainPart.startsWith(".")) {
          return "Le domaine ne doit pas commencer par un point '.'";
        }
        if (domainPart.endsWith(".")) {
          return "Le domaine ne doit pas se terminer par un point '.'";
        }
        return "Adresse email invalide";
      }
    }

    return "";
  };

  return (
    <PaperProvider theme={theme} style={styles.screen}>
      {loading && <Loading />}
      <LinearGradient
        colors={["#67B99A", "#67B99A", "#67B99A", "#469D89"]}
        style={styles.circleBackground}
      ></LinearGradient>
      <ScrollView style={styles.container}>
        <View style={[styles.contFainer, { marginTop: 40 }]}>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={[styles.image, styles.shadow]}
              />
            ) : (
              <Image
                source={profilePlaceholder}
                style={[styles.image, styles.shadow]}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={openImagePicker}
            activeOpacity={0.7}
            style={styles.addPhotot}
          >
            <Icon name="add-a-photo" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { marginTop: 40 }]}>
          <Text style={styles.sectionTitle}>Information personnelle</Text>
          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Numéro Matricule"
              style={styles.input}
              value={matricule}
              onChangeText={(text) => {
                setMatricule(text);
                if (text !== "") {
                  setMatriculeError({ hasError: false, display: "none" });
                } else {
                  setMatriculeError({ hasError: true, display: "block" });
                }
              }}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
              ref={matriculeRef}
              error={matriculeError.hasError}
            />
            <HelperText
              type="error"
              visible={matriculeError.hasError}
              padding="normal"
              style={{ display: matriculeError.display }}
            >
              Veuillez entrer un numero matricule
            </HelperText>

            <View style={styles.anarana}>
              <TextInput
                mode="outlined"
                label="Nom"
                style={[styles.input, styles.namewidth]}
                value={nom}
                onChangeText={(text) => {
                  setNom(text);
                  if (text !== "") {
                    setNomError({ hasError: false, display: "none" });
                  } else {
                    setNomError({ hasError: true, display: "block" });
                  }
                }}
                activeOutlineColor={colors.primary}
                outlineColor={"#000"}
                ref={nomRef}
                error={nomError.hasError}
              />
              <HelperText
                type="error"
                visible={nomError.hasError}
                padding="normal"
                style={{ display: nomError.display }}
              >
                Veuillez entrer un nom
              </HelperText>

              <TextInput
                mode="outlined"
                label="Prénom"
                style={[styles.input, styles.namewidth]}
                value={prenom}
                onChangeText={(text) => {
                  setPrenom(text);
                  if (text !== "") {
                    setPrenomError({ hasError: false, display: "none" });
                  } else {
                    setPrenomError({ hasError: true, display: "block" });
                  }
                }}
                activeOutlineColor={colors.primary}
                outlineColor="#000"
                error={prenomError.hasError}
              />
            </View>
            <HelperText
              type="error"
              visible={prenomError.hasError}
              padding="normal"
              style={{ display: prenomError.display }}
            >
              Veuillez entrer un prenom
            </HelperText>

            <View
              style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Picker
                selectedValue={sexe}
                style={{ borderWidth: 1, borderColor: "black" }}
                outlineColor={"black"}
                mode="dropdown"
                dropdownIconRippleColor={colors.primary}
                dropdownIconColor={colors.primary}
                onValueChange={(itemValue) => {
                  setSexe(itemValue);
                }}
              >
                <Picker.Item label="MALE" value="MALE" />
                <Picker.Item label="FEMALE" value="FEMALE" />
              </Picker>
            </View>

            <View style={styles.datePickerContainer}>
              <View style={styles.dateInputContainer}>
                <TextInput
                  mode="outlined"
                  label="Date de naissance"
                  style={styles.dateInput}
                  value={dateInput}
                  onChangeText={(text) => {
                    handleDateInputChange(text, setDateInput, setDob);
                    if (text !== "") {
                      setDobError({
                        ...dobError,
                        hasError: false,
                        display: "none",
                        message: "La date de naissance est obligatoire",
                      });
                    } else {
                      setDobError({
                        ...dobError,
                        hasError: true,
                        display: "block",
                        message: "La date de naissance est obligatoire",
                      });
                    }
                  }}
                  placeholder="JJ/MM/AAAA"
                  keyboardType="numeric"
                  editable={!showDatePicker} // Disable input when date picker is shown
                  activeOutlineColor={colors.primary}
                  outlineColor="#000"
                  onSelectionChange={handleSelectionChange}
                  error={dobError.hasError}
                />
                <HelperText
                  type="error"
                  visible={dobError.hasError}
                  padding="normal"
                  style={{ display: dobError.display }}
                >
                  {dobError.message}
                </HelperText>
              </View>

              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.9}
              >
                <Icon name="calendar-today" size={50} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dob}
                mode="date"
                display="spinner"
                onChange={onChangeDob}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informatin pédagogique</Text>
          <View styles={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Année universitaire"
              value={anneeUniv}
              onChangeText={setAnneeUniv}
              style={[styles.input, styles.annee_univ]}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
              editable={false}
            />
            <Text style={styles.classLabel}>Classe</Text>
            <View
              style={[
                styles.class,
                {
                  borderColor: parcourError.border,
                  borderWidth: parcourError.bdWidth,
                },
              ]}
            >
              <View style={styles.niveauContainer}>
                <Picker
                  selectedValue={selectedValue}
                  style={styles.picker}
                  mode="dropdown"
                  onValueChange={(itemValue) => {
                    setSelectedValue(itemValue);
                    setNiveau(itemValue);
                    if (itemValue === "M1" || itemValue === "M2") {
                      setListType("master");
                    } else {
                      setListType("lisence");
                    }
                  }}
                >
                  <Picker.Item label="L1" value="L1" />
                  <Picker.Item label="L2" value="L2" />
                  <Picker.Item label="L3" value="L3" />
                  <Picker.Item label="M1" value="M1" />
                  <Picker.Item label="M2" value="M2" />
                </Picker>
              </View>
              <View style={styles.radioButtonParcous}>
                {options.map((option) => (
                  <RadioButton
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    selected={radioselectedValue === option.value}
                    onPress={() => {
                      setRadioselectedValue(option.value);
                      setParcours(option.value);
                      setParcourError({
                        ...parcourError,
                        border: "black",
                        display: "none",
                        bdWidth: 1,
                      });
                    }}
                  />
                ))}
              </View>
            </View>
            <Text
              style={{
                display: parcourError.display,
                color: parcourError.border,
                paddingLeft: 10,
              }}
            >
              {" "}
              Veuillez choisir un parcours
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (validateEmail(text) === "") {
                  setEmailError({
                    ...emailError,
                    hasError: false,
                    display: "none",
                    message: validateEmail(text),
                  });
                } else {
                  setEmailError({
                    ...emailError,
                    hasError: true,
                    display: "block",
                    message: validateEmail(text),
                  });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              style={styles.input}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
              error={emailError.hasError}
            />
            <HelperText
              type="error"
              visible={emailError.hasError}
              padding="normal"
              style={{ display: emailError.display }}
            >
              {emailError.message}
            </HelperText>

            <TextInput
              mode="outlined"
              label="Numero Téléphone"
              value={tel}
              onChangeText={handleNumInput}
              keyboardType="numeric"
              style={styles.input}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
              maxLength={13}
              error={numeroError.hasError}
            />
            <HelperText
              type="error"
              visible={numeroError.hasError}
              padding="normal"
              style={{ display: numeroError.display }}
            >
              {numeroError.message}
            </HelperText>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information civique</Text>
          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Adresse"
              value={adresse}
              onChangeText={(text) => {
                setAdresse(text);
                if (text !== "") {
                  setAdresseError({ hasError: false, display: "none" });
                } else {
                  setAdresseError({ hasError: true, display: "block" });
                }
              }}
              style={styles.input}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
              error={adresseError.hasError}
            />
            <HelperText
              type="error"
              visible={adresseError.hasError}
              padding="normal"
              style={{ display: adresseError.display }}
            >
              L'adresse est obligatoire
            </HelperText>

            <TextInput
              mode="outlined"
              label="Numero de CIN"
              value={cin}
              onChangeText={handleCinInput}
              keyboardType="numeric"
              style={styles.input}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
              maxLength={15}
              error={cinError.hasError}
            />
            <HelperText
              type="error"
              visible={cinError.hasError}
              padding="normal"
              style={{ display: cinError.display }}
            >
              {cinError.message}
            </HelperText>

            <View style={styles.datePickerContainer}>
              <View style={styles.dateInputContainer}>
                <TextInput
                  mode="outlined"
                  label="Date du CIN"
                  style={styles.dateInput}
                  value={cinDateInput}
                  onChangeText={(text) => {
                    handleDateInputChange(text, setCinDateInput, setCin_date);
                    if (text !== "" && cin) {
                      setCinDateError({
                        ...dobError,
                        hasError: false,
                        display: "none",
                        message: "",
                      });
                      setCinError({
                        ...cinError,
                        hasError: false,
                        display: "none",
                        message: "",
                      });
                    } else if (cin && text == "") {
                      setCinDateError({
                        ...dobError,
                        hasError: true,
                        display: "block",
                        message: "Veuillez entrer la date du carte d'identité",
                      });
                    } else if (!cin && text == "") {
                      setCinDateError({
                        ...cinDateError,
                        hasError: false,
                        display: "none",
                        message: "",
                      });
                      setCinError({
                        ...cinError,
                        hasError: false,
                        display: "none",
                        message: "",
                      });
                    } else {
                      setCinDateError({
                        ...dobError,
                        hasError: false,
                        display: "none",
                        message: "",
                      });
                      setCinError({
                        ...cinError,
                        hasError: true,
                        display: "block",
                        message: "Veuillez entrer le numero CIN",
                      });
                    }
                  }}
                  placeholder="JJ/MM/AAAA"
                  keyboardType="numeric"
                  editable={!showCinDatePicker} // Disable input when date picker is shown
                  activeOutlineColor={colors.primary}
                  outlineColor="#000"
                  error={cinDateError.hasError}
                />
                <HelperText
                  type="error"
                  visible={cinDateError.hasError}
                  padding="normal"
                  style={{ display: cinDateError.display }}
                >
                  {cinDateError.message}
                </HelperText>
              </View>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowCinDatePicker(true)}
                activeOpacity={0.9}
              >
                <Icon name="calendar-today" size={50} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {showCinDatePicker && (
              <DateTimePicker
                value={cin_date}
                mode="date"
                display="spinner"
                onChange={onChangeCinDate}
              />
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            textColor={colors.primary}
            style={styles.cancelButton}
            onPress={handleCancelButton}
          >
            Annuler
          </Button>
          <LinearGradient
            colors={[colors.primary, colors.primary]} // Gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.updatebutton}
          >
            <Button
              mode="contained"
              style={styles.button}
              textColor="white"
              icon="account-plus"
              onPress={handleUpdateEtudiant}
            >
              Modifier
            </Button>
          </LinearGradient>
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    zIndex: 0,
  },
  screen: {
    backgroundColor: "white",
  },
  circleBackground: {
    padding: 10,
    width: "200%",
    left: "-50%",
    alignContent: "center",
    aspectRatio: 1,
    borderRadius: 2000000000,
    marginTop: "-160%",
    position: "absolute",
  },
  section: {
    padding: 20,
    backgroundColor: "whitesmoke",
    paddingHorizontal: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  inputContainer: {
    paddingLeft: 0,
  },
  anarana: {
    width: "100%",
  },
  namewidth: {
    width: "100%",
  },
  imageContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
    borderRadius: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 200,
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 4,
  },
  input: {
    width: "100%",
    borderColor: colors.primary,
    marginVertical: 3,
    borderWidth: 0,
    backgroundColor: "whitesmoke",
  },
  annee_univ: {
    marginBottom: 20,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    backgroundColor: "whitesmoke",
    paddingHorizontal: 25,
  },
  button: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: "transparent",
    paddingVertical: 2,
    width: "100%",
  },
  updatebutton: {
    marginBottom: 30,
    marginTop: 20,
    borderRadius: 50,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  contFainer: {
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
    zIndex: 32,
  },
  addPhotot: {
    position: "absolute",
    bottom: 3,
    left: 220,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  clickable: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 18,
    margin: 10,
  },
  cancelButton: {
    marginTop: 20,
    marginBottom: 30,
    borderColor: colors.primary,
    borderWidth: 2,
    fontWeight: "bolder",
    width: "45%",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  dateInput: {
    backgroundColor: "whitesmoke",
  },
  dateInputContainer: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "whitesmoke",
  },
  dateBtn: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: 25, // Makes the button circular
    borderColor: colors.primary,
    borderWidth: 0, // Border around the button
    marginTop: 3,
  },
  picker: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  classLabel: {
    marginTop: 5,
    marginBottom: -25,
    marginLeft: 15,
    zIndex: 9,
    fontSize: 12,
    color: "gray",
  },
  class: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "whitesmoke",
    marginBottom: 4,
    marginTop: 5,
    paddingTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  niveauContainer: {
    width: "33%",
    marginBottom: -5,
  },
  radioButtonParcous: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "center",
    width: "80%",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 25,
  },
  radioButtonText: {
    marginLeft: 3,
    fontSize: 18,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default EditEtudiant;
