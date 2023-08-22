import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Background from "../../components/Background";
import { Bubble, GiftedChat, Actions } from "react-native-gifted-chat";
import { useRoute } from "@react-navigation/native";
import { AccountRealmContext } from "../../models";
import { chats as Chats } from "../../models/Chat";
import { useSelector } from "react-redux";
import { actuatedNormalize } from "../../styles/stylesheet";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { sendPushNotification } from "../../api/Functions";
import { Account, client } from "../../models/Account";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function ChatScreen() {
  const [message, setMessage] = useState([]);
  const route = useRoute();
  const realm = useRealm();
  const { roomId, name } = route.params;
  const allChats = useQuery(Chats);
  const pushToken =
    useQuery(Account).filtered(`name ==$0`, name)[0]?.pushToken ||
    useQuery(client).filtered(`clientId ==$0`, name)?.pushToken;
  const { user } = useSelector((state) => state);
  const chatUser =
    user.role !== "Client"
      ? realm.objectForPrimaryKey("account", Realm.BSON.ObjectId(user._id))
      : useQuery("client").filtered(`clientId == $0`, user.clientId)[0];

  // Update the message status to "read" when the recipient reads the message
  const updateMessageStatusRead = () => {
    const messages = allChats.filtered("roomId = $0", roomId);
    realm.write(() => {
      messages.forEach((message) => {
        message.user._id !== user._id ? (message.status = "read") : null;
      });
    });
  };

  useEffect(() => {
    // Fetch existing messages from the Realm DB
    const fetchedMessages = realm
      .objects("chats")
      .filtered("roomId = $0", roomId)
      .sorted("createdAt", true);
    const parsedMessage = JSON.parse(JSON.stringify(fetchedMessages));
    setMessage(parsedMessage);
    // console.log(Array.isArray(parsedMessage));

    // Configure the Realm DB listener for new messages
    const messageListener = realm
      .objects("chats")
      .filtered("roomId = $0", roomId)
      .addListener(handleNewMessages);
    updateMessageStatusRead();

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
      <Actions
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
      status: "sent", // Set the initial status as "sent"
    };

    realm.write(() => {
      return new Chats(realm, messageObject);
    });

    sendPushNotification(
      pushToken,
      user.name || user.clientId,
      messageObject.text
    );
  }, []);

  function renderBubble(props) {
    const isMessageSent = props.currentMessage.status === "sent";
    const isMessageRead = props.currentMessage.status === null;

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
            marginRight: actuatedNormalize(10),
            marginLeft: actuatedNormalize(10),
            paddingHorizontal: actuatedNormalize(10),
          },
          left: {
            backgroundColor: "#EBEBEB",
            marginRight: actuatedNormalize(10),
            marginLeft: actuatedNormalize(10),
            paddingHorizontal: actuatedNormalize(10),
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
            fontSize: actuatedNormalize(13),
          },
          left: {
            color: "black",
            fontSize: actuatedNormalize(13),
          },
        }}
      >
        {/* Add checkmark icons based on the message status
        {isMessageSent && <Text>Single Checkmark Icon</Text>}
      {isMessageRead && <Text>Read Icon</Text>} */}
      </Bubble>
    );
  }

  function renderMessage(props) {
    return (
      <View style={{ marginVertical: 10 }}>
        {renderDay(props)}
        {renderBubble(props)}
      </View>
    );
  }

  function renderDay(props) {
    if (props.currentMessage.createdAt) {
      const { currentMessage, previousMessage } = props;
      const currentCreatedAt = new Date(currentMessage.createdAt);
      let previousCreatedAt = null;
      const today = new Date();

      if (previousMessage && previousMessage.createdAt) {
        previousCreatedAt = new Date(previousMessage.createdAt);
      }

      let day = null;

      if (
        !previousCreatedAt ||
        currentCreatedAt.toDateString() !== previousCreatedAt.toDateString()
      ) {
        if (currentCreatedAt.toDateString() === new Date().toDateString()) {
          day = "Today";
        } else if (
          currentCreatedAt.toDateString() ===
          new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()
        ) {
          day = "Yesterday";
        } else if (
          props.currentMessage.createdAt >
          today.setDate(today.getDate() - today.getDay())
        ) {
          // day = props.currentMessage.createdAt.toLocaleDateString([], {
          //   weekday: "long",
          // });
          const createdAt = moment(props.currentMessage.createdAt);
          day = createdAt.format("dddd"); // "dddd, LL" represents the format "Day of the Week, Month Day, Year"
        } else {
          // day = props.currentMessage.createdAt.toLocaleDateString([], {
          //   month: "long",
          //   day: "numeric",
          //   year: "numeric",
          // });
          // day = "pjsos";

          const createdAt = moment(props.currentMessage.createdAt);
          day = createdAt.format("LL"); // "LL" represents the format "Month Day, Year"
        }
      }

      if (day) {
        return (
          <View style={{ alignItems: "center", marginVertical: 5 }}>
            <Text style={{ fontSize: 12, color: "#999" }}>{day}</Text>
          </View>
        );
      }
    }

    return null;
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
          renderTicks={(currentMessage) => {
            // Check the status of the current message
            if (currentMessage.user._id == user._id) {
              if (currentMessage.status != "read") {
                // Return a React element to indicate that the message has been sent
                return (
                  <Ionicons name='checkmark-done' size={24} color='gray' />
                );
              } else if (currentMessage.status === "read") {
                // Return a React element to indicate that the message has been read
                return (
                  <Ionicons
                    name='checkmark-done'
                    size={24}
                    color='rgb(168 85 247)"'
                  />
                );
              } else {
                // Return null if no status indicator is needed
                return null;
              }
            } else return null;
          }}
          // renderActions={renderMessageActions}
          // renderDay={renderDay}
        />
      </View>
    </Background>
  );
}
