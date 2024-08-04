import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { colors } from "../utils/Utils";

export default function App() {
  const navigation = useNavigation();

  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [torchon, setTorchon] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [lightdisplay, setLightdisplay] = useState("white");

  useEffect(() => {
    // Define the zoom animation
    const zoomAnimation = () => {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 700,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(zoomAnimation); // Loop the animation
    };

    zoomAnimation(); // Start the animation loop

    return () => {
      scaleValue.stopAnimation(); // Clean up animation on unmount
    };
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleTorch() {
    if (torchon) {
      setTorchon(false);
      setLightdisplay("white");
    } else {
      setTorchon(true);
      setLightdisplay("#FEFFB8");
    }
  }

  const handleQrCodeScanned = ({ type, data }) => {
    setScanned(true);
    navigation.navigate("Information", { data });
    setScanned(false);
  };
  const handleLoginButton = () => {
    navigation.navigate("Connexion");
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={torchon}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleQrCodeScanned}
      >
        <View style={styles.message}>
          <Text style={styles.textmessage}>Scanner un QR Code</Text>
        </View>
        <View style={styles.squareContainer}>
          <Animated.View
            style={[
              styles.square,
              {
                transform: [{ scale: scaleValue }],
              },
            ]}
          >
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </Animated.View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.torchContainer}>
            <TouchableOpacity style={styles.torch} onPress={toggleTorch}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                fill="none"
                viewBox="0 0 21 22"
              >
                <Path
                  fill={lightdisplay}
                  d="M7.248 9.624.861 15.836c-.405.394-.672.898-.742 1.4-.07.503.064.963.372 1.28l2.317 2.382c.308.316.764.462 1.268.407.504-.056 1.015-.309 1.42-.703l6.388-6.213c1.04.225 3.212.353 5.292-1.67l1.53-1.487-8.112-8.34-1.53 1.487c-2.08 2.023-2.012 4.198-1.816 5.245Zm2.234 1.305 1.159 1.191-2.294 2.232-1.16-1.192 2.295-2.231ZM12.888.66 21 9l-1.53 1.488-8.111-8.34L12.887.66Z"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.Login} onPress={handleLoginButton}>
            <Text style={styles.text}>Se Connecter</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "flex-end",
    margin: 20,
    position: "static",
    left: 0,
    bottom: 0,
    width: "100%",
  },
  loginContainer: {
    backgroundColor: "green",
    padding: 20,
  },
  torchContainer: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 25,
    bottom: 10,
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "rgba(2, 2, 2, 0.5)",
  },
  text: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
  },
  torch: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  squareContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30%",
  },
  square: {
    width: "65%",
    aspectRatio: 1,
    backgroundColor: "transparent",
    borderColor: "#F2F2F2",
    borderRadius: 15,
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 60,
    height: 60,
    borderColor: "#F2F2F2",
    borderWidth: 10,
  },
  topLeft: {
    top: -1,
    left: -1,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 18,
  },
  topRight: {
    top: -1,
    right: -1,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 18,
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 18,
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 18,
  },
  Login: {
    position: "absolute",
    right: 20,
    bottom: 20,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  message: {
    marginTop: "10%",
    backgroundColor: "rgba(2, 2, 2, 0.2)",
    padding: 30,
    borderRadius: 10,
  },
  textmessage: {
    color: "white",
  },
});
