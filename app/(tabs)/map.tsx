import React, { useEffect, useState } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { StyleSheet, Text, View, Alert } from "react-native";
import * as LocalAuthentication from 'expo-local-authentication';
import { KEY } from '@env';

export default function MapScreen() {

  // return (
  //   <View style={styles.container}>
  //     <MapView
  //       style={styles.map}
  //       initialRegion={{
  //         latitude: 20.9808114,
  //         longitude: 105.7962285,
  //         latitudeDelta: 0.0922,
  //         longitudeDelta: 0.0421,
  //       }}
  //     >
  //       <Marker
  //         coordinate={{ latitude: 20.9808114, longitude: 105.7962285 }}
  //         title="Vị trí của bạn"
  //         description="Đây là vị trí hiện tại của bạn"
  //       >
  //         <Callout>
  //           <View>
  //             <Text>Học Viện Kỹ Thuật Mật mã</Text>
  //           </View>
  //         </Callout>
  //       </Marker>
  //     </MapView>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
}); 