export class chats extends Realm.Object {
  constructor(realm, messages) {
    super(realm, messages);
  }

  static schema = {
    name: "chats",
    primaryKey: "_id",
    properties: {
      _id: {
        type: "string?",
        default: () => new Realm.BSON.ObjectId().toHexString(),
      },
      text: "string?",
      createdAt: { type: "date?", default: new Date() },
      user: "user?",
      roomId: "string?",
      status: "string?",
    },
  };
}
export class user extends Realm.Object {
  constructor(realm, user) {
    super(realm, user);
  }

  static schema = {
    name: "user",
    embedded: true,
    properties: {
      _id: "string?",
      name: "string?",
      avatar: "string?",
    },
  };
}

export class chatroom extends Realm.Object {
  constructor(realm, chatroom) {
    super(realm, chatroom);
  }

  static schema = {
    name: "chatroom",
    primaryKey: "_id",
    properties: {
      _id: {
        type: "string?",
        default: () => new Realm.BSON.ObjectId().toHexString(),
      },
      senderId: "string",
      recieverId: "string?",
    },
  };
}
