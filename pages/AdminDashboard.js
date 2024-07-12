import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { getEtudiants } from "../services/ApiServices";
import Loading from "../components/Loading";

const AdminDashboard = () => {
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStudents = async () => {
      try {
        const result = await getEtudiants();
        setStudents(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getStudents()
  }, []);

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{students[0].nom}</Text>
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });