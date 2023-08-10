// // This JS version of the Task model shows how to create Realm objects by
// // defining a schema on the class, which is required if your project does not
// // use TypeScript. If you are using TypeScript, we recommend using

// export class Task extends Realm.Object {
//   constructor(realm, description, userId) {
//     super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
//   }

//   // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
// // `@realm/babel-plugin` (https://github.com/realm/realm-js/blob/master/packages/babel-plugin/),
// // which allows you to define your models using TypeScript syntax.
// //
// // See `Task.ts` in the Realm example app for an example of using the plugin.

// import {Realm} from '@realm/react';
//   static schema = {
//     name: 'Task',
//     primaryKey: '_id',
//     properties: {
//       _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
//       description: 'string',
//       isComplete: {type: 'bool', default: false},
//       createdAt: {type: 'date', default: () => new Date()},
//       userId: 'string',
//     },
//   };
// }

// import Realm from "realm";

export class job extends Realm.Object {
  constructor(realm, job) {
    super(realm, job);
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: "job",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      name: "string",
      category: "category",
      duration: "duration?",
      tasks: { type: "list", objectType: "task", default: [] },
    },
  };
}
export class category extends Realm.Object {
  constructor(realm, category) {
    super(realm, category);
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: "category",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      name: "string",
    },
  };
}

export class task extends Realm.Object {
  constructor(realm, task) {
    super(realm, task);
  }
  static schema = {
    name: "task",
    embedded: true,
    properties: {
      name: "string",
      handler: "string?",
      duration: "duration",
      status: { type: "string", default: "Pending" },
      timer: { type: "string?", default: "00:00" },
      remainingTime: { type: "int", default: 0 },
      completedIn: { type: "date?" },
      inProgress: { type: "date?" },
      error: "int?",
      started: "date?",
      finished: "date?",
    },
  };
}
export class duration extends Realm.Object {
  constructor(realm, duration) {
    super(realm, duration);
  }
  static schema = {
    name: "duration",
    embedded: true,
    properties: {
      hours: "int?",
      days: "int?",
      minutes: "int?",
    },
  };
}

export class activejob extends Realm.Object {
  constructor(realm, activejobs) {
    super(realm, activejobs);
  }
  static schema = {
    name: "activejob",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      job: "string?",
      matno: "string?",
      category: "string?",
      supervisor: "string?",
      duration: "string?",
      timeframe: "duration",
      email: "string?",
      started: "date?",
      finished: "date?",
      tasks: { type: "list", objectType: "task", default: [] },
      status: { type: "string", default: "Pending" },
      // time: { type: "string?", default: "0d 0h 0m" },
      completedIn: { type: "date?" },
      inProgress: { type: "date?" },
      password: "string?",
    },
  };
}
