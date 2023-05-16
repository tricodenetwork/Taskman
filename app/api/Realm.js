import { Realm, useApp } from "@realm/react";

export const LogInUser = async () => {
  const app = useApp();
  // This example uses anonymous authentication.
  await app.logIn(Realm.Credentials.anonymous());
  // However, you can use any authentication provider
  // to log a user in with this pattern.
};
