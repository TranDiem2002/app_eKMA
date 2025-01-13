import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { encryptDataAES } from "../util/encryp";
import { KEY } from "@env"; // Import biến từ .env

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    setLoading(true);

    const payload = {
      email: email,
      passWord: password,
    };

    try {
      const encryptedPayload = encryptDataAES(payload, KEY);
      try {
        const response = await fetch("http://172.20.10.2:8080/authenticate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            encryptedPayload, // Gửi dữ liệu đã mã hóa
          ) ,
        });

        const result = await response.json();

        if (response.status === 200 && result.token) {

          await AsyncStorage.setItem("token", result.token);
          const is2FAEnabled = await handleCheck(result.token);
          if(is2FAEnabled) {
            router.push("/verify2FA");
          } else {
            router.push("/(tabs)/calendar");
          }
        } else {
          Alert.alert("Thất bại", result.message || "Sai email hoặc mật khẩu");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể kết nối tới server.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mã hóa thông tin.");
    }

  };
  const handleCheck = async (token: string) => {
    console.log('token', token);
    try {
          const response = await fetch("http://172.20.10.2:8080/2fa/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        
      });

      const result = await response.json();

      if (response.status === 200) {


        return true;
      } else {
        Alert.alert("Thất bại", result.message || "Sai email hoặc mật khẩu");
        return false;
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối tới server.");
      return false;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <TextInput
        style={styles.input}
        placeholder="Username Or Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#9B9B9B"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor="#9B9B9B"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Text>{showPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00C78C",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: "#FFFFFF", 
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeButton: {
    padding: 10,
    paddingRight: 15,
  },
  loginButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  loginButtonText: {
    fontSize: 18,
    color: "#00C78C",
    fontWeight: "bold",
  },
});
