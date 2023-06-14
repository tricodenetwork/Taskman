import { Realm } from "@realm/react";

// export const Account = {
//   name: "account",
//   properties: {
//     _id: "objectId?",
//     __v: "int?",
//     dept: "string?",
//     email: "string?",
//     name: "string?",
//     password: "string?",
//     phone: "string?",
//     role: "string?",
//   },
//   primaryKey: "_id",
// };

export class Account extends Realm.Object {
  constructor(realm, user) {
    super(realm, user);
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: "account",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId?", default: () => new Realm.BSON.ObjectId() },
      // __v: "int?",
      dept: "string?",
      email: "string?",
      name: "string?",
      password: "string?",
      phone: "string?",
      role: "string?",
      category: "category",
      pushToken: "string?",
    },
  };
}
export class client extends Realm.Object {
  constructor(realm, user) {
    super(realm, user);
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: "client",
    primaryKey: "_id",
    properties: {
      email: "string",
      _id: { type: "objectId?", default: () => new Realm.BSON.ObjectId() },
      clientId: "string?",
      role: { type: "string", default: "Client" },
      password: "string?",
    },
  };
}
export class holiday extends Realm.Object {
  constructor(realm, holiday) {
    super(realm, holiday);
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: "holiday",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId?", default: () => new Realm.BSON.ObjectId() },
      day: "date?",
    },
  };
}
