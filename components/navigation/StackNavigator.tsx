import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SearchScreen from "../../app/(tabs)/search"; // Adjust the path as necessary
import SearchDetailScreen from "../../app/(tabs)/searchDetail"; // Adjust the path as necessary

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search" component={SearchScreen} />
      <Stack.Screen name="searchDetail" component={SearchDetailScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
