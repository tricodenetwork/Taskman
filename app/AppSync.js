import React, { useCallback, useEffect, useMemo } from "react";
import { useApp, useUser } from "@realm/react";
import { Pressable, StyleSheet, Text } from "react-native";

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

const { useRealm, useQuery } = AccountRealmContext;

export const AppSync = () => {
  const realm = useRealm();
  const user = useUser();
  const app = useApp();

  // const tasks = useMemo(() => result.sorted("createdAt"), [result]);
  // useEffect(() => {
  //   realm.subscriptions.update((mutableSubs) => {
  //     mutableSubs.add(realm.objects(Account));
  //   });
  // }, [realm, result]);

  // const subs = realm.subscriptions;
  // console.log(subs);
  // const users = realm.objects("account");
  console.log(user.identities[0].id);
  // console.log(user.id);

  // const handleLogout = useCallback(() => {
  //   user?.logOut();
  // }, [user]);

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

          <MainStack />
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