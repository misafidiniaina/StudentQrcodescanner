import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { addEtudiant } from "../services/ApiServices";

const AddingEtudiant = () => {
  const [matricule, setMatricule] = useState("6969");
  const [nom, setNom] = useState("Zaho");
  const [prenom, setPrenom] = useState("Me");
  const [dob, setDof] = useState("2024-07-12T12:14:59.302Z");
  const [niveau, setNiveau] = useState("L2");
  const [parcours, setParcous] = useState("ASR");
  const [email, setEmail] = useState("example@gmail.com");
  const [tel, setTel] = useState("0343434434");
  const [cin, setCin] = useState("101251245123");
  const [cin_date, setCin_date] = useState("2024-07-12T12:14:59.302Z");
  const [adresse, setAdresse] = useState("Tanambao-");
  const [annee_univ, setAnnee_univ] = useState("2023-2024");

  const hangleAddEtudiant = async () => {
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

  return (
    <View style={styles.container}>
      <Text> hello </Text>
      <TextInput style={styles.input} value="nom" placeholder="Nom" />
      <TextInput style={styles.input} value="nom" placeholder="Nom" />
      <TextInput style={styles.input} value="nom" placeholder="Nom" />
      <TouchableOpacity onPress={hangleAddEtudiant}>
        <Text> add </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddingEtudiant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
});
