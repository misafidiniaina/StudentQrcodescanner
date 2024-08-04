import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import profilePlaceholder from "../images/profile_placeholder.jpg";

const EtudiantsInfo = ({ route }) => {
  const { student } = route.params;
  const [imageUri, setImageUri] = useState(null)
  return (
    <View>
      <Text>this is the student Information</Text>
      <Text>{student.nom}</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Image source={profilePlaceholder} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: "white",
  },
});

export default EtudiantsInfo;
