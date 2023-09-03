// hooks/useChatRoom.js

import { useCallback } from "react";
import { AccountRealmContext } from "../models";
import useRealmData from "./useRealmData";
import { useSelector } from "react-redux";

const { useRealm } = AccountRealmContext;

const useActions = () => {
  const realm = useRealm();
  const { chatrooms } = useRealmData();
  const { user } = useSelector((state) => state);

  const createChatRoom = useCallback(
    (recieverId) => {
      const chatRoomId = new Realm.BSON.ObjectId().toHexString();
      const chatRoom = {
        _id: chatRoomId,
        senderId: user._id,
        recieverId,
      };

      const roomId = chatrooms.filtered(
        `senderId == $0 AND recieverId ==$1`,
        user._id,
        recieverId
      );

      if (roomId.length == 0) {
        realm.write(() => {
          realm.create("chatroom", chatRoom);
        });
        return chatRoomId;
      } else {
        return roomId[0]._id;
      }
    },
    [realm, chatrooms.length]
  );

  return {
    createChatRoom,
  };
};

export default useActions;
