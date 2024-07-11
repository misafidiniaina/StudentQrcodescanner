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
import TorchIcon from "../images/icons/torch.svg";

export default function App() {
  const navigation = useNavigation();

  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [torchon, setTorchon] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [lightdisplay, setLightdisplay] = useState("none")

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
    if(torchon){
      setTorchon(false)
      setLightdisplay("none")
    }
    else{
      setTorchon(true)
      setLightdisplay("block")
    }
  }

  const handleQrCodeScanned = ({ type, data }) => {
    setScanned(true);
    navigation.navigate("Result", { data });
    setScanned(false);
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
          <TouchableOpacity style={styles.torch} onPress={toggleTorch}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="46"
              height="40"
              fill="none"
              style={{display: lightdisplay}}
            >
              <Path
                stroke="#FBFF25"
                stroke-linecap="round"
                stroke-width="4"
                d="m2.093 23.306 7.68 5.377m26.082-.017 7.68-5.378m-5.382-13.125-7.923 14.9m-7.5-1.775V2.663m-7.077 22.4-7.923-14.9"
              />
            </Svg>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="75"
              fill="none"
            >
              <Path
                fill="#fff"
                d="M7.5 24.12V45a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V24.12C30.168 22.74 35 19.3 35 12.5v-5H0v5c0 6.8 4.832 10.24 7.5 11.62ZM15 22.5h5V30h-5v-7.5ZM0 0h35v5H0V0Z"
              />
            </Svg>
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
    backgroundColor: "red",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  torch: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  squareContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  square: {
    width: "65%",
    aspectRatio: 1,
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 21,
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 60,
    height: 60,
    borderColor: "white",
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
});
