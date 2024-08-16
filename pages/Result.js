import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { fetchData } from "../services/ApiServices";
import Loading from "../components/Loading";
import { useNavigation } from "@react-navigation/native";

const Result = ({ route }) => {
  const [donnees, setDonnees] = useState(null);
  const [loading, setLoading] = useState(true);
  const { type, data } = route.params;

  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData("9abbfcca-fee8-4307-be6b-baa5a4022d1a");
        if (result) {
          setDonnees(result);
          console.log(result);
          // Navigate with fetched result instead of static studentData if needed
          navigation.navigate("studentInfoPage", { route: result });
        } else {
          Alert.alert("No data", "No data returned from the server.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Result Page
      </Text>
      {donnees ? (
        <View style={{ marginTop: 10 }}>
          <Text>Nom: {donnees.nom}</Text>
          <Text>Prenom: {donnees.prenom}</Text>
          <Text>Date of Birth: {donnees.dob}</Text>
          <Text>CIN: {donnees.cin}</Text>
          <Text>CIN Date: {donnees.cin_date}</Text>
          <Text>Telephone: {donnees.tel}</Text>
          <Text>Email: {donnees.email}</Text>
          <Text>Adresse: {donnees.adresse}</Text>
          <Text>Niveau: {donnees.niveau}</Text>
          <Text>Parcours: {donnees.parcours}</Text>
          <Text>Matricule: {donnees.matricule}</Text>
          <Text>Année Universitaire: {donnees.annee_univ}</Text>
          <Text>ID: {donnees.id}</Text>
        </View>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

export default Result;
