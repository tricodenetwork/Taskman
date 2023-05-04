import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
// import AppLoading from "expo-app-loading";
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  Montserrat_500Medium,
  Montserrat_300Light,
  Montserrat_100Thin,
} from "@expo-google-fonts/montserrat";
import { styles } from "../styles/stylesheet";

import { Motion } from "@legendapp/motion";
import DismissKeyboard from "./DismissKeyboard";
import Map from "./Map";

const MapBackground = ({ children }) => {
  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium,
    Montserrat_300Light,
    Montserrat_100Thin,
  });
  const windowHeight = useWindowDimensions().height;

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <DismissKeyboard>
        <View
          style={[
            {
              minHeight: Math.round(windowHeight),
              position: "absolute",
              bottom: 0,
            },
          ]}
          className='h-full w-full bg-[#ff5000] relative'
        >
          <Map style={styles.image} />
          {children}
        </View>
      </DismissKeyboard>
    );
  }
};

export default MapBackground;
