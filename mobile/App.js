import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { MainStack } from "./src/navigator/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store/store";

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar
      style="light"
        backgroundColor='#004343'
        animated={true}
        //  hidden
      />

      <MainStack />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
