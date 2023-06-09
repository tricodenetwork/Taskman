import { View, Text, KeyboardAvoidingView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Background from "../components/Background";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { AccountRealmContext } from "../models";
import { useUser } from "@realm/react";
import { chats as Chats } from "../models/Chat";
import { log } from "react-native-reanimated";
import { render } from "react-dom";
import { useSelector } from "react-redux";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function ChatScreen() {
  const [message, setMessage] = useState([]);
  const route = useRoute();
  const realm = useRealm();
  const { roomId, name } = route.params;
  const allChats = useQuery(Chats);
  const { user } = useSelector((state) => state);
  const chatUser =
    user.role !== "Client"
      ? realm.objectForPrimaryKey("account", Realm.BSON.ObjectId(user._id))
      : realm.objectForPrimaryKey("client", user._id);

  useEffect(() => {
    // Fetch existing messages from the Realm DB
    const fetchedMessages = realm
      .objects("chats")
      .filtered("roomId = $0", roomId)
      .sorted("createdAt", true);
    const parsedMessage = JSON.parse(JSON.stringify(fetchedMessages));
    setMessage(parsedMessage);

    // Configure the Realm DB listener for new messages
    const messageListener = realm
      .objects("chats")
      .filtered("roomId = $0", roomId)
      .addListener(handleNewMessages);

    return () => {
      // Remove the Realm DB listener when the component unmounts
      if (messageListener) {
        messageListener.remove();
      }
    };
  }, []);

  const handleNewMessages = () => {
    // Handle new messages received from the Realm DB
    const fetchedMessages = realm
      .objects("chats")
      .filtered("roomId = $0", roomId)
      .sorted("createdAt", true);
    setMessage(fetchedMessages);
  };

  // Handler for long press on message
  const handleLongPress = (context, message) => {
    // Perform desired actions based on the long press event
    console.log("Long press on message:", message);
    // Delete the message
    // deleteMessage(message);
  };

  const renderMessageActions = (props, message) => {
    return (
      <MessageActions
        {...props}
        options={{
          delete: {
            onLongPress: () => handleLongPress(props.context, message),
          },
          // Add other options if needed
        }}
      />
    );
  };

  const onSend = useCallback((mess = []) => {
    const messageObject = {
      _id: new Realm.BSON.ObjectId().toHexString(),
      text: mess[0].text,
      createdAt: new Date(),
      user: mess[0].user,
      roomId: roomId,
    };

    realm.write(() => {
      return new Chats(realm, messageObject);
    });
  }, []);

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  }

  function renderMessage(props) {
    return <View style={{ marginVertical: 10 }}>{renderBubble(props)}</View>;
  }
  return (
    <Background bgColor='min-h-97vh'>
      <View className='h-[100%]'>
        <Text className='self-center'>{name}</Text>
        <GiftedChat
          showAvatarForEveryMessage={true}
          loadEarlier={true}
          messages={message}
          onSend={(messages) => onSend(messages)}
          user={{ _id: chatUser._id.toString(), name: chatUser.name }}
          renderMessage={renderMessage}
        />
      </View>
    </Background>
  );
}
