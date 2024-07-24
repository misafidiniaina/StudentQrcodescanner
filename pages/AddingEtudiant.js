import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  Text,
  ScrollView,
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
  const [cin, setCin] = useState("101251245123");
  const [cin_date, setCin_date] = useState(new Date());
  const [adresse, setAdresse] = useState("Tanambao-");
  const [annee_univ, setAnnee_univ] = useState("2023-2024");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCinDatePicker, setShowCinDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState(formatDate(dob));
  const [cinDateInput, setCinDateInput] = useState(formatDate(cin_date));
  const [selectedValue, setSelectedValue] = useState("L1");
  const [radioselectedValue, setRadioselectedValue] = useState(null);
  const [listType, setListType] = useState("premierannee");

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

  const RadioButton = ({ label, value, selected, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer} activeOpacity={0.9}>
        <Icon
          name={selected ? "radio-button-checked" : "radio-button-unchecked"}
          size={17}
          color="#000"
        />
        <Text style={styles.radioButtonText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const handleAddEtudiant = async () => {
    try {
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
    }
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
    const cleanedText = text.replace(/[^0-9\/]/g, "");

    // Limit input length
    if (cleanedText.length <= 10) {
      // Format as DD/MM/YYYY
      const formattedText = cleanedText
        .replace(/(\d{2})(\d{1,2})/, "$1/$2") // Add slash after day
        .replace(/(\d{2}\/)(\d{2})(\d{1,4})/, "$1$2/$3") // Add slash after month
        .substring(0, 10);

      setInput(formattedText);

      // Update date if the text input is valid
      if (formattedText.length === 10) {
        // Expecting DD/MM/YYYY format
        const parsedDate = parseDate(formattedText);
        if (isValidDate(parsedDate)) {
          setDate(parsedDate); // miankina amze format anah date any  @ back ny algorithm @ formatagenito
        }
      }
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <TextInput
          label="Numéro Matricule"
          style={styles.input}
          value={matricule}
          onChangeText={setMatricule}
          activeUnderlineColor="#FF9538"
        />

        <TextInput
          label="Nom"
          style={styles.input}
          value={nom}
          onChangeText={setNom}
          activeUnderlineColor="#FF9538"
        />

        <TextInput
          label="Prénom"
          style={styles.input}
          value={prenom}
          onChangeText={setPrenom}
          activeUnderlineColor="#FF9538"
        />

        <View style={styles.datePickerContainer}>
          <TextInput
            label="Date of Birth"
            style={styles.dateInput}
            value={dateInput}
            onChangeText={(text) =>
              handleDateInputChange(text, setDateInput, setDob)
            }
            placeholder="DD/MM/YYYY"
            keyboardType="numeric"
            editable={!showDatePicker} // Disable input when date picker is shown
            activeUnderlineColor="#FF9538"
          />
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.9}
          >
            <Icon name="calendar-today" size={50} color="#FF9538" />
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
                console.log("Selected value:", itemValue);
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
                  console.log("Selected radio value:", option.value);
                  setRadioselectedValue(option.value);
                }}
              />
            ))}
          </View>
        </View>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          style={styles.input}
          activeUnderlineColor="#FF9538"
        />

        <TextInput
          label="Numero Téléphone"
          value={tel}
          onChangeText={setTel}
          keyboardType="numeric"
          style={styles.input}
          activeUnderlineColor="#FF9538"
        />

        <TextInput
          label="Numero de CIN"
          value={cin}
          onChangeText={setCin}
          keyboardType="numeric"
          style={styles.input}
          activeUnderlineColor="#FF9538"
        />

        <View style={styles.datePickerContainer}>
          <TextInput
            label="CIN Date"
            style={styles.dateInput}
            value={cinDateInput}
            onChangeText={(text) =>
              handleDateInputChange(text, setCinDateInput, setCin_date)
            }
            placeholder="DD/MM/YYYY"
            keyboardType="numeric"
            editable={!showCinDatePicker} // Disable input when date picker is shown
            activeUnderlineColor="#FF9538"
          />
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowCinDatePicker(true)}
            activeOpacity={0.9}
          >
            <Icon name="calendar-today" size={50} color="#FF9538" />
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
          label="Numero de CIN"
          value={adresse}
          onChangeText={setAdresse}
          style={styles.input}
          activeUnderlineColor="#FF9538"
        />

        <TextInput
          label="Année universitaire"
          value={annee_univ}
          onChangeText={setAnnee_univ}
          style={styles.input}
          activeUnderlineColor="#FF9538"
        />

        <Button
          mode="contained"
          onPress={handleAddEtudiant}
          style={styles.button}
          textColor="black"
          fontWeight="100"
          
        >
          Add
        </Button>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  input: {
    width: "100%",
    marginVertical: 5,
    backgroundColor: "white",
    borderColor: "#FF9538",
    borderWidth: 0,
  },
  button: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#FF9538",
    fontWeight: "bold"
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
    borderColor: "#FF9538",
    borderWidth: 0, // Border around the button
  },
  picker: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  classLabel: {
    marginTop: 5,
    marginBottom: -2,
    marginLeft: 10,
  },
  class: {
    flexDirection: "row",
    alignItems: "space-between",
  },
  niveauContainer: {
    width: "32%",
    borderBottomWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    overflow: "hidden",
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
    marginBottom: 15,
    marginRight: 25,
  },
  radioButtonText: {
    marginLeft: 3,
    fontSize: 18,
  },
});

export default AddingEtudiant;
