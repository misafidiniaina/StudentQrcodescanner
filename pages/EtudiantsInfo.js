import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import profilePlaceholder from "../images/profile_placeholder.jpg";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Svg, { Path } from "react-native-svg";
import {
  colors,
  formatCin,
  formatPhoneNumber,
  printableDate,
} from "../utils/Utils";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import * as Sharing from "expo-sharing";
import PDFLib, { PDFDocument, PDFPage } from "react-native-pdf-lib";
import * as Print from "expo-print";

const EtudiantsInfo = ({ route }) => {
  const { student } = route.params;
  const [imageUri, setImageUri] = useState(null);
  const qrCodeRef = useRef(null);

  const handleDownload = async () => {
    try {
      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need permission to access your media library."
        );
        return;
      }

      // Generate QR Code Data URL
      const dataURL = await new Promise((resolve) => {
        qrCodeRef.current?.toDataURL(resolve);
      });

      // Convert Data URL to base64
      const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");

      // Manipulate Image (add padding)
      const { uri: manipulatedUri } = await ImageManipulator.manipulateAsync(
        `data:image/png;base64,${base64Data}`,
        [{ resize: { width: 350, height: 350 } }], // Adjust dimensions for padding
        { format: ImageManipulator.SaveFormat.PNG }
      );

      // Save Image to FileSystem
      const fileName = `${student.matricule}  ${student.niveau} ${student.parcours} ${student.nom} ${student.prenom}.png`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Qrcode", asset, false);

      Alert.alert("QR Code saved!", `Saved to gallery: ${fileUri}`);
    } catch (error) {
      Alert.alert("Pas de code QR", "Cet étudiant ne possède pas de code QR");
    }
  };

  const handleShare = async () => {
    try {
      // Generate QR Code Data URL
      const dataURL = await new Promise((resolve) => {
        qrCodeRef.current?.toDataURL(resolve);
      });

      // Convert Data URL to base64
      const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");

      // Save Image to FileSystem
      const fileName = "qrcode_to_share.png";
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share the image
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while sharing the QR code.");
    }
  };

  const createPDF = async () => {
    try {
      // Define the PDF file name
      const fileName = `${student.matricule}_${student.niveau}_${student.parcours}_${student.nom}_${student.prenom}.pdf`;
      const pdfUri = `${FileSystem.documentDirectory}${fileName}`;
  
      // HTML content for the PDF
      const htmlContent = `
        <html>
          <body>
            <h1>Information Etudiant</h1>
            <p>Matricule: ${student.matricule}</p>
            <p>Nom: ${student.nom}</p>
            <p>Prenom: ${student.prenom}</p>
            <p>Niveau: ${student.niveau}</p>
            <p>Parcours: ${student.parcours}</p>
            <p>Date de naissance: ${printableDate(student.dob)}</p>
            <p>Adresse: ${student.adresse}</p>
            <p>CIN: ${formatCin(student.cin)}</p>
            <p>Fait le: ${printableDate(student.cin_date)}</p>
          </body>
        </html>
      `;
  
      // Generate the PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        // Specify the file path where the PDF will be saved
        filePath: pdfUri,
      });
  
      // Save the PDF to media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need permission to access your media library."
        );
        return;
      }
  
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("PDFs", asset, false);
  
      Alert.alert("PDF saved!", `Saved to gallery: ${uri}`);
    } catch (error) {
      console.error("Error creating PDF:", error);
      Alert.alert("Error", "An error occurred while creating the PDF.");
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#67B99A", "#67B99A", "#67B99A", "#469D89"]}
        style={styles.circleBackground}
      ></LinearGradient>
      <ScrollView style={styles.container}>
        <View style={[styles.section, styles.informationSection]}>
          <TouchableOpacity style={styles.editingBtn}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="30"
              fill="none"
              viewBox="0 0 29 30"
            >
              <Path
                fill={colors.primary}
                fill-rule="evenodd"
                d="M14.367 5.292H3.834C1.992 5.292.5 6.874.5 8.822V26.47C.5 28.42 1.992 30 3.834 30h18.334c1.842 0 3.333-1.58 3.333-3.53V13.552l-6.523 6.907a4.1 4.1 0 0 1-2.127 1.207l-4.469.947c-2.917.617-5.487-2.105-4.903-5.192l.893-4.732a4.497 4.497 0 0 1 1.14-2.253l4.855-5.144Z"
                clip-rule="evenodd"
              />
              <Path
                fill={colors.primary}
                fill-rule="evenodd"
                d="M28.578 2.195a3.667 3.667 0 0 0-.728-1.153A3.334 3.334 0 0 0 26.76.27a3.2 3.2 0 0 0-2.574 0 3.334 3.334 0 0 0-1.09.772l-.91.963L26.94 7.04l.91-.965a3.5 3.5 0 0 0 .728-1.154 3.734 3.734 0 0 0 0-2.725Zm-3.993 7.339-4.756-5.035-7.962 8.433a.9.9 0 0 0-.228.45l-.893 4.734c-.117.617.398 1.16.98 1.037l4.47-.945a.833.833 0 0 0 .425-.242l7.964-8.432Z"
                clip-rule="evenodd"
              />
            </Svg>
          </TouchableOpacity>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Image source={profilePlaceholder} style={styles.image} />
          )}
          <Text>{student.matricule}</Text>
          <Text>{student.nom}</Text>
          <Text>{student.prenom}</Text>
          <Text>
            {student.niveau} {student.parcours}
          </Text>
        </View>
        <View style={styles.haveBackground}>
          <View style={styles.qrcodeSection}>
            <QRCode
              value={student.qrcode[0].data}
              style={styles.qrcode}
              size={200}
              color="black"
              backgroundColor="whitesmoke"
              quietZone={20}
              getRef={(ref) => (qrCodeRef.current = ref)}
            />
            <View style={styles.qrCodeActionContainer}>
              <TouchableOpacity style={styles.qrCodeAction}>
                <Icon name="info" size={25} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.qrCodeAction}>
                <Icon
                  name="sharealt"
                  size={25}
                  color={colors.primary}
                  onPress={handleShare}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.qrCodeAction}
                onPress={handleDownload}
              >
                <Icon name="download" size={25} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionLine}>
              <FontAwesome name="birthday-cake" size={17} />
              <Text style={styles.info}>{printableDate(student.dob)}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionLine}>
              <Entypo name="location-pin" size={20} />
              <Text style={styles.info}>{student.adresse}</Text>
            </View>
            <View style={styles.sectionLine}>
              <FontAwesome name="vcard" size={15} />
              <Text style={styles.info}>{formatCin(student.cin)}</Text>
            </View>
            <Text style={styles.info}>
              <Text style={styles.faitLe}>Fait le </Text>
              {printableDate(student.cin_date)}
            </Text>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionLine}>
              <FontAwesome name="phone" size={15} />
              <Text style={styles.info}>{formatPhoneNumber(student.tel)}</Text>
            </View>
            <View style={styles.sectionLine}>
              <Entypo name="mail" size={17} />
              <Text style={styles.info}>{student.email}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={createPDF}>
              <FontAwesome name="download" size={20} color={"white"} />
              <Text style={styles.buttonText}>Télécharger (Pdf)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    zIndex: 0,
  },
  haveBackground: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 200,
    backgroundColor: "white",
  },
  circleBackground: {
    padding: 10,
    width: "200%",
    left: "-50%",
    alignContent: "center",
    aspectRatio: 1,
    borderRadius: 2000000000,
    marginTop: "-140%",
    position: "absolute",
  },
  informationSection: {
    alignItems: "center",
    position: "relative",
    borderRadius: 20,
    paddingVertical: 40,
    marginHorizontal: 35,
  },
  info: {
    marginLeft: 25,
    color: "gray",
  },
  faitLe: {
    color: "#000",
    fontWeight: "bold",
  },
  editingBtn: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  nom: {},
  class: {},
  matricule: {},
  section: {
    marginVertical: 15,
    paddingVertical: 27,
    paddingHorizontal: 30,
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  sectionLine: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  qrcode: {
    padding: 10,
  },
  qrcodeSection: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "whitesmoke",
    paddingTop: 10,
    borderRadius: 20,
  },
  qrCodeActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 170,
    margin: 15,
  },
  qrCodeAction: {
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 7,
    borderRadius: 50,
    aspectRatio: 1,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 100,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
    marginLeft: 20,
  },
});

export default EtudiantsInfo;
