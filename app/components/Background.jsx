import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";
// import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { useFonts } from "expo-font";

// import {
//  Axiforma_Bold,
// } from "../../assets/fonts/axiforma/Axiforma_Bold";
import { styles } from "../styles/stylesheet";

import { Motion } from "@legendapp/motion";
import DismissKeyboard from "./DismissKeyboard";
import Topscreen from "./Topscreen";
import ProfileCard from "./ProfileCard";

const Background = ({ children, bgColor = "bg-slate-200" }) => {
  //  const [fontLoaded, setFontLoaded] = useState(false);
  //  useEffect(() => {
  //    async function loadFont() {
  //      await ({

  //      setFontLoaded(true);
  //    }

  //    loadFont();
  //  }, []);

  const [fontsLoaded] = useFonts({
    // "Inter-Black": require("../../assets/fonts/Inter-Black.otf"),
    AxiformaMedium: require("../../assets/fonts/axiforma/Axiforma_Medium.ttf"),
    AxiformaBold: require("../../assets/fonts/axiforma/Axiforma_Bold.ttf"),
    AxiformaSemiBold: require("../../assets/fonts/axiforma/Axiforma_SemiBold.ttf"),
    AxiformaRegular: require("../../assets/fonts/axiforma/Axiforma_Regular.ttf"),
    AxiformaThin: require("../../assets/fonts/axiforma/Axiforma_Thin.ttf"),
    AxiformaLight: require("../../assets/fonts/axiforma/Axiforma_Light.ttf"),
  });

  const windowHeight = useWindowDimensions().height;

  if (!fontsLoaded) {
    return <Text className='absolute top-[50vh] left-[50vw]'>Loading...</Text>;
  } else {
    return (
      <DismissKeyboard>
        <View
          // style={[{ maxHeight: Math.round(windowHeight) }]}
          className={`h-full ${bgColor} border- border-red-  w-full relative`}
        >
          {children}
        </View>
      </DismissKeyboard>
    );
  }
};

export default Background;
