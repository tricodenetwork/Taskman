import { View, Text, ImageBackground } from "react-native";
import React from "react";

export default function SplashScreen() {
  return (
    <View className='min-h-screen'>
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../../assets/splash.png")}
      />
    </View>
  );
}
