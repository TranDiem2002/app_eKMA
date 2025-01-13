import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const TwoFactorSetupScreen = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isScanned, setIsScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      getQRCode();
    }
  }, [token]);

  const getQRCode = async () => {
    try {
      const response = await fetch("http://172.20.10.2:8080/2fa/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setQrCodeUrl(data.qrCodeUrl);
      }
    } catch (error) {
      console.error(Error);
    }
  };

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

  const handleEnable2FA = async () => {
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
        setIsScanned(true);
      }
    } catch (error) {
      console.error("verify-otp: ", Error);
    }
  };

  return (
    <View style={styles.container}>
      {!isScanned ? (
        <>
          <Text style={styles.text}>
            Scan this QR code with Google Authenticator
          </Text>
          {qrCodeUrl && (
            <View style={styles.qrCodeContainer}>
              <QRCode value={qrCodeUrl} size={200} />
            </View>
          )}
          <TextInput
            style={styles.textInput}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Enter verification code"
            keyboardType="numeric"
          />
          <Button title="Verify Code" onPress={handleEnable2FA} />
        </>
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>
            ✅ QR Code successfully scanned and verified!
          </Text>
          <Button title="Continue" onPress={() => router.push("/user")} />
        </View>
      )}
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
