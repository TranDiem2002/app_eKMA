import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

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

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch(
            "http://192.168.1.236:8080/user/detail",
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
          Alert.alert("Lỗi", "Có lỗi xảy ra khi gọi API");
        }
      }
    };

    fetchUserData();
  }, [token]);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={require("@/assets/images/avatar.jpg")}
          />
        </View>
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.studentId}>Mã Sinh Viên: {userData.maSV}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{userData.email}</Text>

        <Text style={styles.infoLabel}>Ngày sinh:</Text>
        <Text style={styles.infoValue}>{userData.ngaySinh}</Text>

        <Text style={styles.infoLabel}>Số điện thoại:</Text>
        <Text style={styles.infoValue}>{userData.phone}</Text>

        <Text style={styles.infoLabel}>Phòng/Khoa:</Text>
        <Text style={styles.infoValue}>{userData.khoa}</Text>

        <Text style={styles.infoLabel}>Hệ:</Text>
        <Text style={styles.infoValue}>{userData.he}</Text>

        <Text style={styles.infoLabel}>Lớp:</Text>
        <Text style={styles.infoValue}>{userData.lopCQ}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F1FFF3",
    alignItems: "center",
  },
  profileHeader: {
    backgroundColor: "#00C27C",
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 40,
  },
  avatar: {
    width: 60,
    height: 70,
    borderRadius: 40,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  studentId: {
    fontSize: 14,
    color: "#fff",
  },
  infoContainer: {
    width: "100%",
    borderRadius: 50,
    paddingLeft: 35,
    paddingTop: 10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  infoValue: {
    paddingLeft: 15,
    fontSize: 16,
    color: "#999999",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});