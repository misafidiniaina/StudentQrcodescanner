import React, { useState, useRef } from "react";
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
import { addEtudiant, convertImageToBase64 } from "../services/ApiServices";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { colors, removeSpaces, transformDateToISO } from "../utils/Utils";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import profilePlaceholder from "../images/profile_placeholder.jpg";

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

const AddingEtudiant = () => {
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dob, setDob] = useState(new Date());
  const [niveau, setNiveau] = useState("L2");
  const [parcours, setParcours] = useState("ASR");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [cin, setCin] = useState("");
  const [cin_date, setCin_date] = useState(new Date());
  const [adresse, setAdresse] = useState("");
  const [annee_univ, setAnnee_univ] = useState("2023-2024");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCinDatePicker, setShowCinDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [cinDateInput, setCinDateInput] = useState("");
  const [selectedValue, setSelectedValue] = useState("L1");
  const [radioselectedValue, setRadioselectedValue] = useState(null);
  const [listType, setListType] = useState("premierannee");
  const textInputRef = useRef(null);
  const matriculeRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);

  const normalOptions = [
    { label: "IG", value: "IG" },
    { label: "GB", value: "GB" },
    { label: "SR", value: "SR" },
  ];

  const l1Options = [
    { label: "IG", value: "IG" },
    { label: "GB/SR", value: "GB/SR" },
  ];

  const options = listType === "normal" ? normalOptions : l1Options;

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

  const handleAddEtudiant = async () => {
    const formattedTel = removeSpaces(tel);
    const formattedCin = removeSpaces(cin);
    const formattedDob = transformDateToISO(dob);
    const formattedDateCin = transformDateToISO(cin_date);
    try {
      const result = await addEtudiant(
        nom,
        prenom,
        formattedDob,
        formattedCin,
        formattedDateCin,
        formattedTel,
        email,
        adresse,
        niveau,
        parcours,
        matricule,
        annee_univ
      );
      Alert.alert(result);
    } catch (error) {
      Alert.alert(error);
    }

    const message = [
      `Matricule: ${matricule}`,
      `Nom: ${nom}`,
      `Prénom: ${prenom}`,
      `Date of Birth: ${formattedDob}`, // Make sure to format the date properly
      `CIN: ${formattedCin}`,
      `CIN Date: ${formattedDateCin}`,
      `Téléphone: ${formattedTel}`,
      `Email: ${email}`,
      `Adresse: ${adresse}`,
      `Niveau: ${niveau}`,
      `Parcours: ${parcours}`,
      `Année Universitaire: ${annee_univ}`,
    ].join("\n");
    Alert.alert("Student Information", message);
    console.log("eto no manomboka");
  };

  const handleCancelButton = () => {
    setNom("");
    setPrenom("");
    setMatricule("");
    setDob("");
    setCin("");
    setCin_date("");
    setTel("");
    setEmail("");
    setAdresse("");
    setNiveau("");
    setParcours("");
    setAnnee_univ("2023-2024");
    // matriculeRef.current.focus();
    setImageUri(null);
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
    setCin(formattedText);
  };
  return (
    <PaperProvider theme={theme} style={styles.screen}>
      <LinearGradient
        colors={["#67B99A","#67B99A","#67B99A","#469D89" ]}
        style={styles.circleBackground}
      ></LinearGradient>
      <ScrollView style={styles.container}>
        <View style={[styles.contFainer, { marginTop: 40 }]}>
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
              onChangeText={setMatricule}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
              ref={matriculeRef}
            />

            <View style={styles.anarana}>
              <TextInput
                mode="outlined"
                label="Nom"
                style={[styles.input, styles.namewidth]}
                value={nom}
                onChangeText={setNom}
                activeOutlineColor={colors.primary}
                outlineColor="#000"
              />

              <TextInput
                mode="outlined"
                label="Prénom"
                style={[styles.input, styles.namewidth]}
                value={prenom}
                onChangeText={setPrenom}
                activeOutlineColor={colors.primary}
                outlineColor="#000"
              />
            </View>

            <View style={styles.datePickerContainer}>
              <TextInput
                mode="outlined"
                label="Date of Birth"
                style={styles.dateInput}
                value={dateInput}
                onChangeText={(text) =>
                  handleDateInputChange(text, setDateInput, setDob)
                }
                placeholder="JJ/MM/AAAA"
                keyboardType="numeric"
                editable={!showDatePicker} // Disable input when date picker is shown
                activeOutlineColor={colors.primary}
                outlineColor="#000"
                onSelectionChange={handleSelectionChange}
              />
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
                display="default"
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
              value={annee_univ}
              onChangeText={setAnnee_univ}
              style={[styles.input, styles.annee_univ]}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
            />
            <Text style={styles.classLabel}>Classe</Text>
            <View style={styles.class}>
              <View style={styles.niveauContainer}>
                <Picker
                  selectedValue={selectedValue}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    setSelectedValue(itemValue);
                    if (itemValue === "L1") {
                      setListType("premierannee");
                    } else {
                      setListType("normal");
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
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              style={styles.input}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
            />
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
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information civique</Text>
          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Adresse"
              value={adresse}
              onChangeText={setAdresse}
              style={styles.input}
              activeOutlineColor={colors.primary}
              outlineColor="#000"
            />
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
            />

            <View style={styles.datePickerContainer}>
              <TextInput
                mode="outlined"
                label="CIN Date"
                style={styles.dateInput}
                value={cinDateInput}
                onChangeText={(text) =>
                  handleDateInputChange(text, setCinDateInput, setCin_date)
                }
                placeholder="JJ/MM/AAAA"
                keyboardType="numeric"
                editable={!showCinDatePicker} // Disable input when date picker is shown
                activeOutlineColor={colors.primary}
                outlineColor="#000"
              />
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
                display="default"
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
            style={styles.addbutton}
          >
            <Button
              mode="contained"
              onPress={handleAddEtudiant}
              style={styles.button}
              textColor="white"
              icon="account-plus"
            >
              Ajouter
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
    marginVertical: 2,
    borderColor: colors.primary,
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
  addbutton: {
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
    alignItems: "center",
    marginVertical: 10,
  },
  dateInput: {
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
    alignItems: "space-between",
    backgroundColor: "whitesmoke",
    marginBottom: 4,
    marginTop: 5,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: "black",
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
    alignItems: "flex-end",
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default AddingEtudiant;
