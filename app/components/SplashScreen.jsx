import { ImageBackground, Animated } from "react-native";
import React, { useEffect, useRef } from "react";

export default function SplashScreen() {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();
    setTimeout(() => {
      fadeOut();
    }, 10000);
  }, []);

  return (
    <Animated.View
      // style={{ opacity: fadeAnim }}
      className='bg-white flex justify-center  min-h-screen'
    >
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../../assets/splash.png")}
      />
    </Animated.View>
  );
}
