import React, { useEffect } from 'react';
import { View, Text,Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'

export default function IndexScreen() {
  const router = useRouter(); 

  // Automatically navigate to the home screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home'); // Navigate to the home screen
    }, 1000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [router]);
  
  return (
    <View style={styles.container}>
       <Image
          source={require('@/assets/images/calendar.png')}
          style={styles.icon}
        />
      <Text style={styles.title}>eKMA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00C78C',
  },
  touchableArea:{
    padding: 20,
    borderRadius: 8,
  },
  icon:{
    width: 100,
    height: 100,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
