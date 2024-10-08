import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, Menu } from "react-native-paper";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";

// Import your screens
import Scann from "./pages/Scann";
import Result from "./pages/Result";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AddingEtudiant from "./pages/AddingEtudiant";
import EtudiantsInfo from "./pages/EtudiantsInfo";
import EditEtudiant from "./pages/EditEtudiant";
import NoResult from "./pages/NoResult";

const Stack = createStackNavigator();

export default function App() {
  const [visible, setVisible] = useState(false);
  const [isReady, setIsReady] = useState(false); // New state to control splash screen
 

  useEffect(() => {
    async function prepare() {
      try {
        // Prevent the splash screen from hiding until we are ready
        await SplashScreen.preventAutoHideAsync();

        // Simulate an async task, like fetching data or initializing
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Example delay

        // Mark app as ready
        setIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync(); // Hide splash screen when ready
    }
  }, [isReady]); // Dependency array with `isReady`

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
              options={{ headerShown: false }}
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
              name="studentInfoPage"
              component={EtudiantsInfo}
              options={({ route }) => {
                const { isEditable, student } = route.params;

                return {
                  title: "Information",
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
                          console.log(student.id);
                        }}
                        disabled={!isEditable}
                        title="Supprimer l'étudiant"
                        leadingIcon={({ size, color }) => (
                          <Feather
                            name="trash-2"
                            color={color}
                            size={size - 3}
                          />
                        )}
                      />
                    </Menu>
                  ),
                  headerRightContainerStyle: styles.rightStyle,
                };
              }}
            />
            <Stack.Screen
              name="Editer Étudiant"
              component={EditEtudiant}
              options={{
                title: "Modification",
                headerTitleAlign: "center",
                headerTitleStyle: styles.ajoutTitle,
                headerStyle: styles.ajoutHeader,
                headerShadowVisible: false,
                headerBackTitleStyle: styles.backStyle,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="NoResult"
              component={NoResult}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
        <Toast />
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
