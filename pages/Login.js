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
import { TextInput as InputText } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import NoConnection from "./NoConnection";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ereur, setEreur] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [eyeName, setEyeName] = useState("eye-off");
  const [hasConnection, setHasConnection] = useState(true);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login(username, password);
      if (data.jwt) {
        await AsyncStorage.setItem("access_token", data.jwt);
        setLoading(false);
        navigation.navigate("Dashboard", { added: null, updated: null });
      } else {
        setEreur("Mot de passe ou non d'utilisateur incorrect");
        setLoading(false);
      }
    } catch (err) {
      setEreur("Mot de passe ou non d'utilisateur incorrect");
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

  if (!hasConnection) {
    return <NoConnection />;
  }

  return (
    <View style={styles.container}>
      {loading && <Loading />}
      <View style={styles.loginStyle}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="110%"
          height="275"
          fill="none"
          viewBox="0 0 353 275"
        >
          <Path
            fill="#036666"
            d="m259.931 225.486-37.787-33.975a99.994 99.994 0 0 0-49.128-24.053l-60.084-10.826a108.014 108.014 0 0 1-42.121-17.351A163.651 163.651 0 0 1 0 4.513V-16.5h377v251c-36.555 23.879-84.601 20.179-117.069-9.014Z"
          />
          <Path
            fill="#248277"
            d="m260.81 172.369-21.202-20.736a99.995 99.995 0 0 0-51.304-26.76l-57.947-10.979a72.253 72.253 0 0 1-14.271-4.267A150.461 150.461 0 0 1 27.771 6.825L22-16.5h357l-2 216-3.332.98c-39.935 11.746-83.099.994-112.858-28.111Z"
          />
          <Path
            fill="#56AB91"
            d="m282.476 153.426-44.624-46.374a75.999 75.999 0 0 0-43.303-22.434l-44.163-6.737a100 100 0 0 1-72.24-50.12L54-15.5h278l44-1.5 1.5 198.5a100.17 100.17 0 0 1-95.024-28.074Z"
          />
        </Svg>
      </View>
      <View style={styles.loginInputContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Connexion</Text>
        </View>
        <View style={styles.inputContainer}>
          <InputText
            label="Nom d'utilisateur"
            mode="outlined"
            outlineColor="#555555"
            activeOutlineColor={colors.primary}
            outlineStyle={{ borderRadius: 10, borderWidth: 1.5 }}
            style={{ backgroundColor: "transparent", marginVertical: 20 }}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <InputText
            label="Mot de passe"
            secureTextEntry={!showPassword}
            mode="outlined"
            outlineColor="#555555"
            activeOutlineColor={colors.primary}
            outlineStyle={{ borderRadius: 10, borderWidth: 1.5 }}
            style={{ backgroundColor: "transparent" }}
            value={password}
            onChangeText={setPassword}
            right={
              <InputText.Icon
                icon={eyeName}
                onPress={() => {
                  if (showPassword) {
                    setShowPassword(false);
                    setEyeName("eye-off");
                  } else {
                    setShowPassword(true);
                    setEyeName("eye");
                  }
                }}
              />
            }
          />
        </View>
        <View style={styles.erroContainer}>
          <Text style={styles.errorMessage}>{ereur}</Text>
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>SE CONNECTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  loginInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
    paddingBottom: "20%",
    backgroundColor: "whitesmoke",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
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
  loginStyle: {
    top: 0,
    right: "10%",
    width: "100%",
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 35,
  },
  titleContainer: {
    marginTop: 25,
    marginBottom: 15,
  },
});

export default LoginScreen;
