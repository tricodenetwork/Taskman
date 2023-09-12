import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@realm/react";
import { Platform } from "react-native";

import { holiday } from "./models/Account";
import { AccountRealmContext } from "./models";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MainStack } from "./navigator/AppNavigator";
import RealmPlugin from "realm-flipper-plugin-device";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { chatroom, chats } from "./models/Chat";
import { category, job } from "./models/Task";
import { LinearGradient } from "expo-linear-gradient";
import { SCREEN_HEIGHT } from "./styles/stylesheet";

const originalWarn = console.warn; // Store the original console.warn method

console.warn = function (...args) {
  if (args[0].includes("Could not find Fiber with id")) {
    // Ignore the specific warning message
    return;
  }

  // Call the original console.warn method for other warning messages
  originalWarn.apply(console, args);
};

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
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

    token = (await Notifications.getExpoPushTokenAsync()).data;
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

const { useRealm, useQuery, useObject } = AccountRealmContext;

export const AppSync = () => {
  const realm = useRealm();
  const user = useUser();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const oid = user.identities[0].id.trim();
  const cleanedOid = oid.replace(/[^0-9a-zA-Z-]/g, "");
  const appuser =
    cleanedOid.length > 22
      ? useObject("account", Realm.BSON.ObjectId(cleanedOid))
      : useQuery("client").filtered(`clientId ==$0`, cleanedOid)[0];

  const subscribe = () => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(realm.objects(chats));
      mutableSubs.add(realm.objects(chatroom));
      mutableSubs.add(realm.objects(category));
      mutableSubs.add(realm.objects(holiday));
      mutableSubs.add(realm.objects(job));
      // mutableSubs.add(realm.objects(client));
    });
  };

  useEffect(() => {
    setTimeout(() => subscribe(), 1000);
  }, [realm]);

  // const handleLogout = useCallback(() => {
  //   user?.logOut();
  // }, [user]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      realm.write(() => {
        appuser.pushToken = token;
      });
    });

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
  }, [expoPushToken]);

  return (
    <>
      <Provider store={store}>
        {/* <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}> */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LinearGradient
            colors={["#1F271B", "#0C4D4D"]}
            style={{
              height:
                SCREEN_HEIGHT < 500
                  ? 0.05 * SCREEN_HEIGHT
                  : 0.04 * SCREEN_HEIGHT,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <StatusBar
              style='light'
              backgroundColor='transparent'
              translucent={true}
            />
            {/* rest of your components */}
          </LinearGradient>
          <RealmPlugin realms={[realm]} />
          <MainStack />
          {/* <Login /> */}
        </GestureHandlerRootView>
        {/* </PersistGate> */}
      </Provider>
    </>
  );
};

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
