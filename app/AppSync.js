import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useApp, useUser } from "@realm/react";
import {
  Pressable,
  StyleSheet,
  Platform,
  Text,
  KeyboardAvoidingView,
} from "react-native";

import { Account } from "./models/Account";
import { AccountRealmContext } from "./models";
import { buttonStyles } from "./styles/button";
import { shadows } from "./styles/shadows";
import colors from "./styles/colors";
import { OfflineModeButton } from "./components/OfflineModeButton";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/lib/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MainStack } from "./navigator/AppNavigator";
import RealmPlugin from "realm-flipper-plugin-device";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { user, chatroom, chats } from "./models/Chat";

const originalWarn = console.warn; // Store the original console.warn method

console.warn = function (...args) {
  if (args[0].includes("Could not find Fiber with id")) {
    // Ignore the specific warning message
    return;
  }

  // Call the original console.warn method for other warning messages
  originalWarn.apply(console, args);
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  console.log("Registering for the token");
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    console.log("before the token");
    token = (await Notifications.getExpoPushTokenAsync()).data;

    console.log(token);
    console.log("After the token");
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const { useRealm, useQuery } = AccountRealmContext;

export const AppSync = () => {
  const realm = useRealm();
  const user = useUser();
  const app = useApp();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // const tasks = useMemo(() => result.sorted("createdAt"), [result]);
  // useEffect(() => {
  //   realm.subscriptions.update((mutableSubs) => {
  //     mutableSubs.add(realm.objects(chats));
  //     mutableSubs.add(realm.objects(chatroom));
  //   });
  // }, [realm]);

  // const subs = realm.subscriptions;
  // console.log(subs);
  // const users = realm.objects("account");
  console.log(user.identities[0].id);
  console.log(expoPushToken, "pushtoken");
  // console.log(user.id);

  // const handleLogout = useCallback(() => {
  //   user?.logOut();
  // }, [user]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <>
      <Provider store={store}>
        {/* <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}> */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar
            style='light'
            backgroundColor='#004343'
            animated={true}
            //  hidden
          />
          <RealmPlugin realms={[realm]} />
          {/* <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior='padding'> */}
          <MainStack />
          {/* </KeyboardAvoidingView> */}
        </GestureHandlerRootView>
        {/* </PersistGate> */}
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  idText: {
    color: "#999",
    paddingHorizontal: 20,
  },
  authButton: {
    ...buttonStyles.button,
    ...shadows,
    backgroundColor: colors.purpleDark,
  },
  authButtonText: {
    ...buttonStyles.text,
  },
});

{
  /* <Text style={styles.idText}>Syncing with app id: {app.id}</Text>
    <TaskManager tasks={tasks} userId={user?.id} />
    <Pressable style={styles.authButton} onPress={handleLogout}>
      <Text
        style={styles.authButtonText}
      >{`Logout ${user?.profile.email}`}</Text>
    </Pressable>
    <OfflineModeButton /> */
}
