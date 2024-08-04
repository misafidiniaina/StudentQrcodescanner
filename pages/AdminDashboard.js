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
} from "react-native";
import { deleteEtudiant, getEtudiants } from "../services/ApiServices";
import Loading from "../components/Loading";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../utils/Utils";

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [etudiantNumber, setEtudiantNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSwipeableId, setOpenSwipeableId] = useState(null);
  const swipeableRefs = useRef({});

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const result = await getEtudiants();
      setStudents(result);
      setEtudiantNumber(result.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (id) => {
    const student = students.find((etudiant) => etudiant.id === id);
    if (student) {
      Alert.alert("Student Information", JSON.stringify(student));
      navigation.navigate("Information ", { student });
    } else {
      Alert.alert("Error", "Student not found");
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(id.toString());
    try {
      const result = await deleteEtudiant(id);
      //message management
    } catch (error) {
      console.error("error:", error);
    }
    setStudents(students.filter((student) => student.id !== id));
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
      <RectButton style={styles.editButton} onPress={() => handleArchive(id)}>
        <Text style={styles.editButtonText}>Edit</Text>
      </RectButton>
      <RectButton style={styles.deleteButton} onPress={() => handleDelete(id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </RectButton>
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable
      ref={(ref) => (swipeableRefs.current[item.id] = ref)}
      friction={3}
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
            <Text style={styles.matricule}>{item.matricule}</Text>
            <View style={styles.class}>
              <Text style={styles.studentInfo}>{item.niveau}</Text>
              <Text style={styles.studentInfo}>{item.parcours}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text
              style={styles.studentName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.nom} {item.prenom}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#032949","#005D80" ]}
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
    color: "gray"
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
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  right: {
    width: "80%",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  studentName: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
  matricule: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#5d5d5d",
  },
  class: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    justifyContent: "center",
    paddingVertical: 3,
    borderRadius: 20,
    marginVertical: 3,
  },
  studentInfo: {
    marginHorizontal: 6,
    fontSize: 12,
    color: "gray",
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
  },
  editButton: {
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "85%",
    borderRadius: 10,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  editButtonText: {
    color: "white",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "85%",
    borderRadius: 10,
    marginRight: 10,
    paddingHorizontal: 10,
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
