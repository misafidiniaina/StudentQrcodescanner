import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { deleteEtudiant, getEtudiants } from "../services/ApiServices";
import Loading from "../components/Loading";
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../utils/Utils";
import profilePlaceholder from "../images/profile_placeholder.jpg";

const EXPO_PUBLIC_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const EXPO_PUBLIC_API_PORT = process.env.EXPO_PUBLIC_API_PORT;

const AdminDashboard = ({ route }) => {
  const { added, updated } = route.params;

  const navigation = useNavigation();
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [etudiantNumber, setEtudiantNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSwipeableId, setOpenSwipeableId] = useState(null);
  const swipeableRefs = useRef({});
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    if (added) {
      setStudents((prevStudents) => [...prevStudents, added]);
      setEtudiantNumber(etudiantNumber + 1)
    }
  }, [added]);

  useEffect(() => {
    if (updated) {
      // Update logic here, e.g., find the student by ID and update it
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updated.id ? updated : student
        )
      );
    }
  }, [updated]);

  const getStudents = async () => {
    try {
      const result = await getEtudiants();
      setStudents(result);
      setEtudiantNumber(result.length);
      setLoading(false);
    } catch (error) {
      ToastAndroid.show(
        "Aucune connexion, Veuillez reessayer",
        ToastAndroid.SHORT
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (id) => {
    const student = students.find((etudiant) => etudiant.id === id);
    if (student) {
      navigation.navigate("studentInfoPage", { isEditable: true, student });
    } else {
      ToastAndroid.show(
        "Une erreur est survenue, Veuillez reessayer",
        ToastAndroid.SHORT
      );
    }
  };

  const showConfirmationDialog = (id) => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer cet étudiant ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => handleDelete(id),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  const handleDelete = async (id) => {
    try {
      await deleteEtudiant(id);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
      ToastAndroid.show("L'étudiant(e) est supprimé(e)", ToastAndroid.SHORT);
    } catch {
      ToastAndroid.show(
        "Une erreur est survenue, Veuillez reessayer",
        ToastAndroid.SHORT
      );
    }
  };
  const handleEdit = async (id) => {
    setLoadingEdit(true); // Start loading

    try {
      const student = students.find((etudiant) => etudiant.id === id);
      if (student) {
        navigation.navigate("Editer Étudiant", { student });
      } else {
        ToastAndroid.show(
          "Une erreur est survenue, Veuillez reessayer",
          ToastAndroid.SHORT
        );
      }
    } finally {
      setLoadingEdit(false); // Stop loading
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    closeSwipeable(openSwipeableId);
  };

  const handleAddButton = () => {
    navigation.navigate("Ajout Étudiant");
    closeSwipeable(openSwipeableId);
  };

  const filteredStudents = students?.filter((student) =>
    `${student.nom} ${student.prenom}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const closeSwipeable = (id) => {
    if (swipeableRefs.current[id]) {
      swipeableRefs.current[id].close();
    }
  };

  const onSwipeableWillOpen = async (id) => {
    // Close the previously open swipeable if necessary
    if (openSwipeableId && openSwipeableId !== id) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      closeSwipeable(openSwipeableId);
    }
    setOpenSwipeableId(id);
  };

  const renderRightActions = (id) => (
    <View style={styles.actionsContainer}>
      <RectButton
        style={styles.deleteButton}
        onPress={() => showConfirmationDialog(id)}
      >
        <Text style={styles.deleteButtonText}>
          <AntDesign name="delete" size={20} color={"white"} />
        </Text>
      </RectButton>
      {loadingEdit ? (
        <RectButton style={styles.editButton} onPress={() => handleEdit(id)}>
          <ActivityIndicator color="white" />
        </RectButton>
      ) : (
        <RectButton style={styles.editButton} onPress={() => handleEdit(id)}>
          <Text style={styles.editButtonText}>
            <AntDesign name="edit" size={20} />
          </Text>
        </RectButton>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable
      ref={(ref) => (swipeableRefs.current[item.id] = ref)}
      friction={4}
      overshootRight={true}
      renderRightActions={() => renderRightActions(item.id)}
      onSwipeableOpenStartDrag={() => onSwipeableWillOpen(item.id)}
      onSwipeableClose={() => {
        if (openSwipeableId === item.id) {
          setOpenSwipeableId(null);
        }
      }}
    >
      <TouchableOpacity
        style={[styles.studentContainer, styles.shadow]}
        activeOpacity={1}
        onPress={() => handleStudentClick(item.id)}
      >
        <View style={[styles.studentInfoContainer]}>
          <View style={styles.left}>
            {item.profilePicture ? (
              <Image
                source={{
                  uri: `${EXPO_PUBLIC_API_BASE_URL}:${EXPO_PUBLIC_API_PORT}${item.profilePicture.path}`,
                }}
                style={styles.image}
              />
            ) : (
              <Image source={profilePlaceholder} style={styles.image} />
            )}
          </View>
          <View style={styles.right}>
            <Text
              style={styles.studentName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.nom} {item.prenom}
            </Text>
            <View style={styles.studentInfo}>
              <View style={styles.class}>
                <Text style={styles.classText}>{item.niveau}</Text>
                <Text style={styles.classText}> {item.parcours}</Text>
              </View>
              <Text style={styles.matricule}>{item.matricule}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#67B99A", "#469D89"]}
        style={styles.searchContainer}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Liste de tous les étudiants</Text>
          <Text style={styles.studentNumber}>Total: {etudiantNumber}</Text>
        </View>
        <View style={styles.searchBar}>
          <Icon
            name="search"
            size={20}
            color="#000"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un nom"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </LinearGradient>
      {loading && <Loading />}
      {filteredStudents?.length > 0 ? (
        <FlatList
          data={filteredStudents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          style={styles.flatList}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Aucun résultats</Text>
        </View>
      )}
      <TouchableOpacity
        style={[styles.addEtudiant, styles.shadow]}
        activeOpacity={0.8}
        onPress={handleAddButton}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: 50,
    marginBottom: 10,
    backgroundColor: "white",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    marginHorizontal: 2,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 20,
    marginLeft: 10,
    color: "gray",
  },
  searchInput: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    paddingTop: 5,
    color: "#fff",
  },
  studentNumber: {
    fontWeight: "bold",
    paddingVertical: 15,
    color: "#fff",
  },
  list: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  flatList: {
    flexGrow: 1,
  },
  studentContainer: {
    marginBottom: 10,
    marginHorizontal: 15,
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "white",
  },
  studentInfoContainer: {
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 10,
  },
  left: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "white",
    borderRadius: 200,
    aspectRatio: 1,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  right: {
    width: "80%",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    height: 50,
    aspectRatio: 1,
    borderRadius: 100,
  },
  studentName: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
  matricule: {
    fontSize: 13,
    color: "#5d5d5d",
    marginHorizontal: 7,
  },
  class: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 20,
  },
  classText: {
    fontSize: 13,
    color: "#5d5d5d",
  },
  studentInfo: {
    fontSize: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  addEtudiant: {
    position: "absolute",
    bottom: 25,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  addText: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    color: "gray",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginLeft: -15,
    marginRight: 5,
  },
  editButton: {
    backgroundColor: "#4F6867",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    aspectRatio: 1,
    borderRadius: 10,
  },
  editButtonText: {
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#DC6262",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  deleteButtonText: {
    color: "white",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
