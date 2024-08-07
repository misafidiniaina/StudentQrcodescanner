import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Scann from "./pages/Scann";
import Result from "./pages/Result";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionSpecs,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AddingEtudiant from "./pages/AddingEtudiant";
import EtudiantsInfo from "./pages/EtudiantsInfo";

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
            options={{
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerTitle,
            }}
          />
          <Stack.Screen
            name="Connexion"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={AdminDashboard}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Ajout Étudiant"
            component={AddingEtudiant}
            options={{
              headerTitleAlign: "center",
              headerTitleStyle: styles.ajoutTitle,
              headerStyle: styles.ajoutHeader,
              headerShadowVisible: false,
              headerBackTitleStyle: styles.backStyle,
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Information "
            component={EtudiantsInfo}
            options={{
              title: "Profile",
              headerTitleAlign: "center",
              headerTitleStyle: styles.ajoutTitle,
              headerStyle: styles.ajoutHeader,
              headerShadowVisible: false,
              headerBackTitleStyle: styles.backStyle,
              headerTintColor: "white",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#black",
    alignItems: "center",
    justifyContent: "center",
  },
  backStyle: {
    color: "white",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 25,
  },
  ajoutTitle: {
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
  },
  ajoutHeader: {
    backgroundColor: "transparent",
  },
  DashboardTitle: {
    display: "none",
    backgroundColor: "blue",
  },
});
