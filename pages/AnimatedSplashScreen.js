import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from "react-native";
import * as SplashScreen from "expo-splash-screen";

const { width, height } = Dimensions.get("window");

const AnimatedSplashScreen = ({ onAnimationEnd }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity value

  useEffect(() => {
    SplashScreen.preventAutoHideAsync(); // Prevent auto-hide

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      SplashScreen.hideAsync(); // Hide splash screen after animation
      onAnimationEnd(); // Callback to navigate to the main app
    });
  }, [fadeAnim, onAnimationEnd]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Welcome to Qrcodescanner</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  animatedView: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});

export default AnimatedSplashScreen;
