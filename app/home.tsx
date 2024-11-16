import React from 'react';
import { View, Text,Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'

export default function HomeScreen() {
  const router = useRouter(); 
  const handleLogin = () => {
    router.push('/login'); 
  };
  
  return (
    <View style={styles.container}>
     <Image
        source={require('@/assets/images/calendar.png')}
        style={styles.icon}
      />
    <Text style={styles.title}>eKMA</Text>
    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
    </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1FFF3',
  },
  icon:{
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#00D09E',
    fontWeight: 'bold',
    marginBottom: 80
  },
  loginButton: {
    backgroundColor: '#00C78C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});
