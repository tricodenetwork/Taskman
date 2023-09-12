import "react-native-gesture-handler";

import { Text } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { MainStack } from "./src/navigator/AppNavigator";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar
            style='light'
            backgroundColor='#004343'
            animated={true}
            //  hidden
          />
          <MainStack />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
