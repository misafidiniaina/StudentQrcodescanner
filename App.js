import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, Menu } from "react-native-paper";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather"

import Scann from "./pages/Scann";
import Result from "./pages/Result";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AddingEtudiant from "./pages/AddingEtudiant";
import EtudiantsInfo from "./pages/EtudiantsInfo";

const Stack = createStackNavigator();

export default function App() {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Provider>
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
              options={() => ({
                title: null,
                headerTitleAlign: "center",
                headerTitleStyle: styles.ajoutTitle,
                headerStyle: styles.ajoutHeader,
                headerShadowVisible: false,
                headerBackTitleStyle: styles.backStyle,
                headerTintColor: "white",
                headerLeft: null,
                headerRight: () => (
                  <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchorPosition="bottom"
                    statusBarHeight={25}
                    anchor={
                      <TouchableOpacity
                        onPress={openMenu}
                        style={styles.threeDotContainer}
                      >
                        <Entypo
                          name="dots-three-horizontal"
                          size={30}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    }
                    contentStyle={{
                      backgroundColor: "whitesmoke",
                    }}
                  >
                    <Menu.Item
                      onPress={() => {
                        closeMenu();
                        console.log("Supprimer l'étudiant");
                      }}
                      title="Supprimer l'étudiant"
                      leadingIcon={({ size }) => (
                        <Feather name="trash-2" color="gray" size={size-3} />
                      )}
                      titleStyle={{
                        color: "gray",
                      }}
                    />
                  </Menu>
                ),
                headerRightContainerStyle: styles.rightStyle,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
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
  threeDotContainer: {
    backgroundColor: "transparent",
  },
  rightStyle: {
    paddingHorizontal: 20,
  },
});
