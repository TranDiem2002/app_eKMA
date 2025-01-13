import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const TwoFactorSetupScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
      }
    } catch (error) {
      console.error(Error);
    }
  };

  const handleVerify2FA = async () => {
    try {
      const response = await fetch("http://172.20.10.2:8080/2fa/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          otp: verificationCode,
        }),
      });
      if (response.ok) {
        router.push("/(tabs)/results");
      }
    } catch (error) {
      console.error("error: ", Error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Xin hãy nhập mã OTP ở trong google authenticator app của bạn
      </Text>
      <TextInput
        style={styles.textInput}
        value={verificationCode}
        onChangeText={setVerificationCode}
        placeholder="Nhập mã OTP"
        keyboardType="numeric"
      />
      <Text style={styles.text}>Xác thực sai xin hãy nhập lại</Text>
      <Button title="Xác thực OTP" onPress={handleVerify2FA} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7FFF3", // Light green background like in the image
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: "#333333", // Dark text color
    textAlign: "center",
    marginBottom: 16,
  },
  textEr: {
    fontSize: 16,
    color: "#F56C6C", // Dark text color
    textAlign: "center",
    marginBottom: 16,
  },
  qrCodeContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  textInput: {
    backgroundColor: "#FFFFFF", // White background
    borderWidth: 1,
    borderColor: "#CCCCCC", // Light border
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    width: "80%", // Adjust width to fit nicely in the layout
    marginBottom: 16,
    marginTop: 16,
  },
  button: {
    backgroundColor: "#00A676", // Green button background
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  successMessage: {
    fontSize: 18,
    color: "#008000", // Green success text
    marginBottom: 16,
    textAlign: "center",
  },
});

export default TwoFactorSetupScreen;
