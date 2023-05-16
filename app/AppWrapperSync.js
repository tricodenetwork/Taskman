import React from "react";
import {
  Realm,
  AppProvider,
  UserProvider,
  createRealmContext,
} from "@realm/react";
import { SafeAreaView, StyleSheet } from "react-native";

import { AccountRealmContext } from "./models";
import { LoginScreen } from "./components/LoginScreen";
import colors from "./styles/colors";
import { AppSync } from "./AppSync";
import Login from "./screens/Login";

export const AppWrapperSync = ({ appId }) => {
  const { RealmProvider } = AccountRealmContext;

  // If we are logged in, add the sync configuration the the RealmProvider and render the app
  return (
    <SafeAreaView style={styles.screen}>
      <AppProvider id={appId}>
        <UserProvider fallback={Login}>
          <RealmProvider
            sync={{
              flexible: true,
              initialSubscriptions: {
                update(subs, realm) {
                  subs.add(realm.objects("account"));
                },
              },

              onError: console.error,
            }}
          >
            <AppSync />
          </RealmProvider>
        </UserProvider>
      </AppProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
});

export default AppWrapperSync;
