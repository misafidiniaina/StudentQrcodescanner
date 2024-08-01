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
import { addEtudiant } from "../services/ApiServices";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../utils/Utils";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

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
  const [image, setImage] = useState(null);

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
        setImage(result.assets[0].uri);
      }
    } else if (action === "pickImage") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
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
    /*try {
      const result = await addEtudiant(
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
        annee_univ
      );
      Alert.alert(result);
    } catch (error) {
      Alert.alert(error);
    }*/
    const message = [
      `Matricule: ${matricule}`,
      `Nom: ${nom}`,
      `Prénom: ${prenom}`,
      `Date of Birth: ${formatDate(dob)}`, // Make sure to format the date properly
      `CIN: ${cin}`,
      `CIN Date: ${formatDate(cin_date)}`,
      `Téléphone: ${tel}`,
      `Email: ${email}`,
      `Adresse: ${adresse}`,
      `Niveau: ${niveau}`,
      `Parcours: ${parcours}`,
      `Année Universitaire: ${annee_univ}`,
    ].join("\n");
    Alert.alert("Student Information", message);
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
    <PaperProvider>
      <ScrollView style={styles.container}>
        <TextInput
          mode="outlined"
          label="Numéro Matricule"
          style={styles.input}
          value={matricule}
          onChangeText={setMatricule}
          activeOutlineColor={colors.primary}
          ref={matriculeRef}
        />

        <TextInput
          mode="outlined"
          label="Nom"
          style={styles.input}
          value={nom}
          onChangeText={setNom}
          activeOutlineColor={colors.primary}
        />

        <View style={styles.contFainer}>
          <TouchableOpacity onPress={openImagePicker} activeOpacity={0.7}>
            <Icon name="photo" size={50} color={colors.primary} />
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>

        <TextInput
          mode="outlined"
          label="Prénom"
          style={styles.input}
          value={prenom}
          onChangeText={setPrenom}
          activeOutlineColor={colors.primary}
        />

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
        />

        <TextInput
          mode="outlined"
          label="Numero Téléphone"
          value={tel}
          onChangeText={handleNumInput}
          keyboardType="numeric"
          style={styles.input}
          activeOutlineColor={colors.primary}
          maxLength={13}
        />

        <TextInput
          mode="outlined"
          label="Numero de CIN"
          value={cin}
          onChangeText={handleCinInput}
          keyboardType="numeric"
          style={styles.input}
          activeOutlineColor={colors.primary}
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

        <TextInput
          mode="outlined"
          label="Adresse"
          value={adresse}
          onChangeText={setAdresse}
          style={styles.input}
          activeOutlineColor={colors.primary}
        />

        <TextInput
          mode="outlined"
          label="Année universitaire"
          value={annee_univ}
          onChangeText={setAnnee_univ}
          style={styles.input}
          activeOutlineColor={colors.primary}
        />

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
            colors={["#FF9538", "#FF5F6D"]} // Gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addbutton}
          >
            <Button
              mode="contained"
              onPress={handleAddEtudiant}
              style={styles.button}
              textColor="black"
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  image: {
    width: 200,
    height: 200,
  },
  input: {
    width: "100%",
    marginVertical: 5,
    backgroundColor: "white",
    borderColor: colors.primary,
    borderWidth: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
    flexDirection: "row",
    justifyContent: "space-around"
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
    backgroundColor: "white",
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
    backgroundColor: "white",
    marginBottom: 4,
    marginTop: 5,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
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
});

export default AddingEtudiant;
