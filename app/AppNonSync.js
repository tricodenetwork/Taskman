import "react-native-gesture-handler";

import React from "react";

import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";

export const AppNonSync = () => {
  // const result = useQuery();

  // const tasks = useMemo(() => result.sorted("createdAt"), [result]);

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
          {/* <MainStack /> */}
          <Text className='text-4xl relative text-white top-32'>
            look at me here
          </Text>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};
