import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { fetchData } from "../services/FetchData";

const Result = ({ route }) => {
  const [donnees, setDonnees] = useState(null);
  const [loading, setLoading] = useState(true);
  const { type, data } = route.params;

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(data);
        setDonnees(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [data]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00ffff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Result Page
      </Text>
      {donnees && (
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
      )}
    </View>
  );
};

export default Result;
