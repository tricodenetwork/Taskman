import { createRealmContext } from "@realm/react";
import { Account } from "./Account";
import { job, task, activejob } from "./Task";

// export const TaskRealmContext = createRealmContext({
//   schema: [Task],
// });
export const AccountRealmContext = createRealmContext({
  schema: [Account, job, task, activejob],
});

// export const JobRealmContext = createRealmContext({
//   schema: [jobSchema],
// }); 
    