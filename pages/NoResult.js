import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import Svg, { Path, Rect } from "react-native-svg";
import { colors } from "../utils/Utils";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const NoResult = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Code QR non valide</Text>
        <Text style={styles.message}>
          Ce code QR ne correspond à aucun étudiant
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="174"
          height="174"
          fill="none"
          viewBox="0 0 174 174"
        >
          <Path
            fill="#545454"
            d="M77.333 0a19.333 19.333 0 0 1 19.285 17.883l.049 1.45v58a19.333 19.333 0 0 1-17.884 19.285l-1.45.049h-58A19.333 19.333 0 0 1 .048 78.783L0 77.333v-58A19.333 19.333 0 0 1 17.883.048L19.333 0h58Zm0 19.333h-58v58h58v-58ZM62.833 29a4.833 4.833 0 0 1 4.756 3.963l.078.87v29a4.834 4.834 0 0 1-3.964 4.756l-.87.078h-29a4.834 4.834 0 0 1-4.756-3.964l-.077-.87v-29a4.833 4.833 0 0 1 3.963-4.756l.87-.077h29ZM174 19.333A19.332 19.332 0 0 0 154.667 0h-19.334A19.331 19.331 0 0 0 116 19.333v19.334A19.332 19.332 0 0 0 135.333 58h19.334A19.331 19.331 0 0 0 174 38.667V19.333Zm-174 116A19.331 19.331 0 0 1 19.333 116h19.334A19.332 19.332 0 0 1 58 135.333v19.334A19.331 19.331 0 0 1 38.667 174H19.333A19.332 19.332 0 0 1 0 154.667v-19.334ZM154.667 116A19.33 19.33 0 0 1 174 135.333v19.334A19.33 19.33 0 0 1 154.667 174h-19.334A19.33 19.33 0 0 1 116 154.667v-19.334A19.33 19.33 0 0 1 135.333 116h19.334ZM116 87a9.666 9.666 0 0 1 9.667-9.667h38.666a9.668 9.668 0 0 1 6.836 16.502 9.668 9.668 0 0 1-6.836 2.832h-38.666A9.668 9.668 0 0 1 116 87Zm-19.333 38.667a9.668 9.668 0 0 0-16.502-6.836 9.668 9.668 0 0 0-2.832 6.836v38.666a9.668 9.668 0 0 0 16.502 6.836 9.668 9.668 0 0 0 2.832-6.836v-38.666Z"
          />
        </Svg>
        <View style={styles.questionMarkContainer}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="70"
            height="70"
            fill="none"
            viewBox="0 0 11 18"
          >
            <Path
              fill="#fff"
              d="M7.739 15.213a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
            />
            <Path
              fill="#fff"
              fill-rule="evenodd"
              d="M5.71 3.765c-.67 0-1.245.2-1.65.486-.39.276-.583.597-.639.874a1.45 1.45 0 0 1-2.842-.574c.227-1.126.925-2.045 1.809-2.67.92-.65 2.086-1.016 3.322-1.016 2.557 0 5.208 1.71 5.208 4.456 0 1.59-.945 2.876-2.169 3.626a1.45 1.45 0 1 1-1.514-2.474c.57-.349.783-.794.783-1.152 0-.574-.715-1.556-2.308-1.556Z"
              clip-rule="evenodd"
            />
            <Path
              fill="#fff"
              fill-rule="evenodd"
              d="M5.71 7.63c.8 0 1.45.648 1.45 1.45v1.502a1.45 1.45 0 1 1-2.9 0V9.08c0-.8.649-1.45 1.45-1.45Z"
              clip-rule="evenodd"
            />
            <Path
              fill="#fff"
              fill-rule="evenodd"
              d="M9.239 6.966a1.45 1.45 0 0 1-.5 1.99l-2.284 1.367a1.45 1.45 0 1 1-1.49-2.488L7.25 6.467a1.45 1.45 0 0 1 1.989.499Z"
              clip-rule="evenodd"
            />
          </Svg>
        </View>
      </View>
      <View style={styles.buttonSection}>
        <Button
          mode="contained"
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.button}
          textColor="white"
          icon="arrow-left"
        >
          Revenir
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },
  titleSection: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 50,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 35,
    paddingVertical: 30,
  },
  message: {
    textAlign: "center",
    fontSize: 15,
    paddingVertical: 10,
    
  },
  imageContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 70,
  },
  questionMarkContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    backgroundColor: "#DC6262",
    borderRadius: 2000,
    padding: 15
  },
  buttonSection: {
    marginBottom: 50,
  },
  button: {
    width: "100%",
    padding: 7,
    backgroundColor: colors.primary,
    borderRadius: 200,
    fontWeight: "bold"
  },
});

export default NoResult;
