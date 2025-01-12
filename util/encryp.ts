import CryptoJS from "crypto-js";
import 'react-native-get-random-values';

export const encryptDataAES = (data, key) => {
  try {
    if (!data) {
      throw new Error("Data is required");
    }

    // Convert data to string if it's an object
    const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);

    // Generate a random IV (16 bytes) for CBC mode
    const iv = CryptoJS.lib.WordArray.random(16);

    // Encrypt data using AES CBC mode with IV
    const encrypted = CryptoJS.AES.encrypt(dataString, CryptoJS.enc.Utf8.parse(key), {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7
    });

    // Return both encrypted data and IV (Base64 encoded)
    return {
      encryptedData: encrypted.toString(),
      iv: iv.toString(CryptoJS.enc.Base64)
    };
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};
