import 'react-native-get-random-values';
import CryptoJS from "crypto-js";
import { IV, KEY } from '@env';

export const encryptDataAES = (data: { email: string; passWord: string; }, key: string) => {
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

export const decryptDataAES = (encryptedData: string | CryptoJS.lib.CipherParams, key: string = KEY) => {
  console.log(encryptedData);
  try {
    if (encryptedData === undefined || encryptedData === null) {
      console.error("Encrypted data, key, and IV are required");
    }

    // Decode the IV from Base64
    // Decrypt data using AES CBC mode with IV
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Base64.parse(IV),
      padding: CryptoJS.pad.Pkcs7
    });

    // Convert decrypted data to string
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    console.log('decryptedData: ', decrypted);
    // Parse JSON if the decrypted data is a JSON string
    try {
      return JSON.parse(decryptedData);
    } catch (e) {
      return decryptedData; 
    }
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};

