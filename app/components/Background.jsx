import React from "react";
import { Text } from "react-native";
// import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

// import {
//  Axiforma_Bold,
// } from "../../assets/fonts/axiforma/Axiforma_Bold";

import DismissKeyboard from "./DismissKeyboard";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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

  if (!fontsLoaded) {
    return (
      <Text className='absolute text-primary top-[50vh] text-center w-full'>
        Loading...
      </Text>
    );
  } else {
    return (
      <SafeAreaProvider>
        <DismissKeyboard>
          <SafeAreaView
            // style={[{ minHeight: Math.round(windowHeight) }]}
            className={`${bgColor} h-full  border-red-500   w-full relative`}
          >
            {children}
          </SafeAreaView>
        </DismissKeyboard>
      </SafeAreaProvider>
    );
  }
};

export default Background;
