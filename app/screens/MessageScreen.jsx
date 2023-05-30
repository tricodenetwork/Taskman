import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Background from "../components/Background";
import SelectComponent from "../components/SelectComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { AccountRealmContext } from "../models";
import { Account } from "../models/Account";
import { addChat, deleteChat } from "../store/slice-reducers/ChatSlice";
import { useDispatch, useSelector } from "react-redux";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { chatroom, chats } from "../models/Chat";
import { log } from "react-native-reanimated";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function MessageScreen({ navigation }) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const realm = useRealm();
  const supervisors = useQuery(Account);
  const allChats = useQuery(chats);
  const { chat } = useSelector((state) => state.Chat);
  const { id } = useSelector((state) => state.user);
  const chatrooms = useQuery("chatroom").filtered(
    "senderId == $0 ||  recieverId == $0",
    id
  );
  // const chatrooms = useQuery(chatroom).filtered(`senderId || receiverId ==$0`);
  // console.log(allChats);

  // Assuming you have set up the Realm DB connection and defined schemas

  // Create a chat room
  const createChatRoom = (recieverId) => {
    // console.log(recieverId);
    // Generate a unique chat room ID
    const chatRoomId = new Realm.BSON.ObjectId().toHexString();

    // Store the chat room in the Realm DB
    const chatRoom = {
      _id: chatRoomId,
      senderId: id,
      recieverId,
      // Additional properties if needed
    };

    const roomId = chatrooms.filtered(
      `senderId == $0 AND recieverId ==$1`,
      id,
      recieverId
    );

    if (roomId.length == 0) {
      // Save the chat room object to the Realm DB
      realm.write(() => {
        realm.create("chatroom", chatRoom);
      });
      // Return the created chat room ID

      return chatRoomId;
    } else {
      return roomId._id;
    }
  };

  return (
    <Background>
      <SafeAreaView className='relative bg-red-100 w-full h-full'>
        {/* <SelectComponent title={"Add"} /> */}
        <FlatList
          data={chatrooms}
          renderItem={({ item }) => {
            const name = realm.objectForPrimaryKey(
              "account",
              id == item.senderId
                ? Realm.BSON.ObjectId(item.recieverId)
                : Realm.BSON.ObjectId(item.senderId)
            );

            const chats = allChats.filtered(`roomId == $0`, item._id);
            const pop = chats[chats.length - 1];
            // console.log(item);
            console.log(pop);
            return (
              <View>
                <View className='h-[10vh] px-[2vw] flex flex-row justify-between pt-[3vh]'>
                  <TouchableOpacity
                    onPress={() => {
                      //   console.log(item.recieverId);
                      navigation.navigate("chats", {
                        roomId: item._id,
                        // name: item.recipient,
                        // recieverId: item.recieverId,
                        // messages: item.messages,
                      });
                    }}
                  >
                    <View className='w-[80vw]'>
                      <Text>{name && name?.name}</Text>
                      <Text style={[styles.text_tiny]}>{pop.text}</Text>
                    </View>
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(deleteChat(item));
                      }}
                    >
                      <AntDesign name='close' size={actuatedNormalize(20)} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
        {visible && (
          <View className='bg-emerald-300 h-full w-[70vw] pl-[3vw] pt-[1vh] absolute bottom-0 right-0'>
            <Text className='text-center'>Supervisors</Text>
            <FlatList
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      // realm.write(() => {
                      //   realm.delete(chatrooms);
                      // });
                      const roomId = createChatRoom(item._id.toHexString());

                      navigation.navigate("chats", {
                        roomId: roomId,
                        name: item.name,
                      });
                      setVisible(!visible);
                    }}
                  >
                    <View className='h-[10vh] pt-[3vh]'>
                      <Text>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              data={supervisors}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            setVisible(!visible);
          }}
          activeOpacity={0.2}
        >
          <View className='absolute bottom-[5vh] right-[5vw] bg-emerald-500 p-[3vw] rounded-full'>
            <AntDesign name='message1' size={24} color='black' />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Background>
  );
}
