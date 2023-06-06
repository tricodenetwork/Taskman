import { createRealmContext } from "@realm/react";
import { Account, client } from "./Account";
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
    client,
  ],
  schemaVersion: 3,
  // onMigration: (oldRealm, newRealm) => {
  //   // only apply this change if upgrading schemaVersion
  //   if (oldRealm.schemaVersion < 3) {
  //     const oldObjects = oldRealm.objects(task);
  //     const newObjects = newRealm.objects(task);
  //     // loop through all objects and set the fullName property in the
  //     // new schema
  //     for (const objectIndex in oldObjects) {
  //       const oldObject = oldObjects[objectIndex];
  //       const newObject = newObjects[objectIndex];
  //       newObject._id = `${oldObject.name}`;
  //     }
  //   }
  // },
});

// export const JobRealmContext = createRealmContext({
//   schema: [jobSchema],
// }); 
    