import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "../utils/Utils";
import { useNavigation } from "@react-navigation/native";
import noConnectionImage from "../images/illustrations/NoConnection.png";

const NoConnection = () => {
  const navigation = useNavigation();

  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Aucune Connexion</Text>
        <Text style={styles.message}>veuillez vérifier votre connexion</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={noConnectionImage} style={styles.image}  />
      </View>
      <View style={styles.buttonSection}>
        <Button
          mode="contained"
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.button}
          textColor={colors.primary}
          icon="reload"
        >
          Réessayer
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "space-between",
  },
  titleSection: {
    alignItems: "center",
    paddingTop: 50
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 35,
  },
  message: {
    textAlign: "center",
    fontSize: 15,
    paddingTop: 10,
  },
  imageContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  questionMarkContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    backgroundColor: "#DC6262",
    borderRadius: 2000,
    padding: 15,
  },
  buttonSection: {
    marginBottom: 50,
  },
  button: {
    width: "100%",
    padding: 7,
    backgroundColor:"transparent",
    borderRadius: 200,
    fontWeight: "bold",
    borderColor: colors.primary,
    borderWidth: 2
  },
  image: {
    width: "100%",
    height: "70%",
  }
});

export default NoConnection;
