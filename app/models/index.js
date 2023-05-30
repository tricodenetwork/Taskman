import { createRealmContext } from "@realm/react";
import { Account } from "./Account";
import { job, task, activejob, duration, category } from "./Task";
import { user, chatroom, chats } from "./Chat";

// export const TaskRealmContext = createRealmContext({
//   schema: [Task],
// });
export const AccountRealmContext = createRealmContext({
  schema: [
    Account,
    job,
    task,
    activejob,
    chats,
    chatroom,
    user,
    duration,
    category,
  ],
  schemaVersion: 2,
});

// export const JobRealmContext = createRealmContext({
//   schema: [jobSchema],
// }); 
    