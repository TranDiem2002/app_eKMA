import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy token");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể lấy token từ bộ nhớ");
      }
    };

    getToken();
  }, []);

  const fetchStudents = async (query: any) => {
    try {
      const response = await fetch(
        `http://192.168.76.82:8080/search/${query}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUserData(data);
      } else {
        Alert.alert("Lỗi", "Không thể lấy thông tin người dùng");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tìm kiếm sinh viên");
    }
  };

  const handleDetails = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>Search</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập mã sinh viên/họ tên..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={() => fetchStudents(searchText)}
          returnKeyType="search"
          blurOnSubmit
        />
      </View>

      {userData && (
        <View style={styles.listItem}>
          <View style={styles.userInfo}>
            <Image
              source={require("@/assets/images/avatar.jpg")}
              style={styles.userIcon}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userData.hoTen}</Text>
              <Text style={styles.userId}>Mã SV: {userData.maSV}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={handleDetails}
          >
            <Text style={styles.detailsButtonText}>CHI TIẾT</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {userData && (
              <>
                <Text style={styles.modalTitle}>Thông tin chi tiết</Text>
                <Text style={styles.modalContentDetail}>
                  Họ và tên: {userData.hoTen}
                </Text>
                <Text style={styles.modalContentDetail}>
                  Mã sinh viên: {userData.maSV}
                </Text>
                <Text style={styles.modalContentDetail}>
                  Lớp: {userData.lopCQ}
                </Text>
                <Text style={styles.modalContentDetail}>
                  Hệ đào tạo: {userData.he}
                </Text>
                <Text style={styles.modalContentDetailEnd}>
                  Khoa: {userData.khoa}
                </Text>
                <Button title="Đóng" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1FFF3",
  },
  searchContainer: {
    backgroundColor: "#00C78C",
    height: 180,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  searchTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
    marginTop: 45,
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userIcon: {
    width: 40,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 15,
  },
  userDetails: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userId: {
    fontSize: 14,
    color: "#777",
  },
  detailsButton: {
    backgroundColor: "#00C78C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalContentDetail: {
    marginBottom: 10,
  },
  modalContentDetailEnd: {
    marginBottom: 20,
  },
});
