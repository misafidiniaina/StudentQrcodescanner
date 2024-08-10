// screens/LoginScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { login } from "../services/ApiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../components/Loading";
import { colors } from "../utils/Utils";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ereur, setEreur] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login(username, password);
      if (data.jwt) {
        await AsyncStorage.setItem("access_token", data.jwt);
        setLoading(false);
        navigation.navigate("Dashboard");
      } else {
        setEreur("Mot de passe ou Username incorrect");
        setLoading(false);
      }
    } catch (err) {
      setEreur("Mot de passe ou Username incorrect");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ereur) {
      const timer = setTimeout(() => {
        setEreur(null);
      }, 5000); // Clear error after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [ereur]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: admin"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.erroContainer}>
        <Text style={styles.errorMessage}>{ereur}</Text>
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.textButton}>SE CONNECTER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
    backgroundColor: "white",
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    marginBottom: 5,
    paddingLeft: 3,
    fontSize: 13,
    color: "#181A1B",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    marginBottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#555555",
    borderRadius: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    textAlign: "center",
    marginVertical: 30,
    borderRadius: 25,
  },
  textButton: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
  erroContainer: {
    width: "100%",
  },
});

export default LoginScreen;
