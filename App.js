import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Scann from "./pages/Scann";
import Result from "./pages/Result";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

const Stack = createStackNavigator();



export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Scann">
          <Stack.Screen
            name="Scann"
            component={Scann}
            options={{ headerShown: false }}
            />
          <Stack.Screen
            name="Information"
            component={Result}
            options={{ headerTitleAlign: "center", headerTitleStyle: styles.headerTitle }}
          />
          <Stack.Screen
            name="Connexion"
            component={Login}
            options={{ headerTitleAlign: "center", headerTitleStyle: styles.headerTitle}}
          />
          <Stack.Screen
            name="Dashboard"
            component={AdminDashboard}
            options={{ headerTitleAlign: "center", headerTitleStyle: styles.headerTitle}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#black",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 30
  }
});
