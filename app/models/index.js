import { createRealmContext } from "@realm/react";
import { Account } from "./Account";

// export const TaskRealmContext = createRealmContext({
//   schema: [Task],
// });
export const AccountRealmContext = createRealmContext({
  schema: [Account],
});
    