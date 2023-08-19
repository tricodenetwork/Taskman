import React from "react";
import {
  Realm,
  AppProvider,
  UserProvider,
  createRealmContext,
} from "@realm/react";
import { SafeAreaView, StyleSheet } from "react-native";

import { AccountRealmContext } from "./models";
import { AppSync } from "./AppSync";
import Login from "./screens/Login";
import SplashScreen from "./components/SplashScreen";

export const AppWrapperSync = ({ appId }) => {
  const { RealmProvider } = AccountRealmContext;

  // If we are logged in, add the sync configuration the the RealmProvider and render the app
  return (
    <SafeAreaView style={styles.screen}>
      <AppProvider id={appId}>
        <UserProvider fallback={Login}>
          <RealmProvider
            fallback={SplashScreen}
            sync={{
              flexible: true,
              initialSubscriptions: {
                update(subs, realm) {
                  const subscriptionConfigs = [
                    { object: realm.objects("account"), name: "Acounts" },
                    { object: realm.objects("activejob"), name: "ActiveJobs" },
                    { object: realm.objects("client"), name: "Client" },
                    // Add more subscription configurations as needed
                  ];

                  const subscriptionPromises = subscriptionConfigs.map(
                    ({ object, name }) => {
                      return subs.add(object, { name });
                    }
                  );

                  Promise.all(subscriptionPromises)
                    .then(() => {
                      console.log("All subscriptions added successfully");
                    })
                    .catch((error) => {
                      console.error("Failed to add subscriptions:", error);
                    });
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
  },
});

export default AppWrapperSync;
