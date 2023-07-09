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
import { chatroom, chats, user } from "../models/Chat";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Motion } from "@legendapp/motion";
import { activejob } from "../models/Task";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function MessageScreen({ navigation }) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const realm = useRealm();
  const { user } = useSelector((state) => state);
  // const { ActiveJob } = useSelector((state) => state);
  const ActiveJob = useQuery(activejob).filtered(`matno == $0`, user.clientId);
  const contacts =
    user.role == "Handler" || user.role == "Supervisor"
      ? useQuery(Account)
          .filtered(
            `(role == "Handler" || role =="Supervisor") AND category.name ==$0 AND name !=$1`,
            user.category.name,
            user.name
          )
          .sorted("name")
      : useQuery(Account)
          .filtered(
            `role == "Supervisor" AND name == $0`,
            ActiveJob[0]?.supervisor
          )
          .sorted("name");
  const allChats = useQuery(chats);
  const chatrooms = useQuery("chatroom").filtered(
    "senderId == $0 ||  recieverId == $0",
    user._id
  );
  // Create a chat room
  const createChatRoom = (recieverId) => {
    // Generate a unique chat room ID
    const chatRoomId = new Realm.BSON.ObjectId().toHexString();

    // Store the chat room in the Realm DB
    const chatRoom = {
      _id: chatRoomId,
      senderId: user._id,
      recieverId,
      // Additional properties if needed
    };

    const roomId = chatrooms.filtered(
      `senderId == $0 AND recieverId ==$1`,
      user._id,
      recieverId
    );
    // Check if chatroom exist and create one if not
    if (roomId.length == 0) {
      // Create a new chat room object in the Realm DB
      realm.write(() => {
        realm.create("chatroom", chatRoom);
      });
      // Return the created chat room ID

      return chatRoomId;
    } else {
      return roomId[0]._id;
    }
  };

  return (
    <Background>
      <SafeAreaView className='relative bg-red-100 w-full h-full'>
        {/* <SelectComponent title={"Add"} /> */}
        <FlatList
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            <View>
              <Text
                style={[styles.text, { fontSize: actuatedNormalize(17) }]}
                className='px-[2vw] text-primary mb-[2vh] pt-[0vh]'
              >
                Chats
              </Text>
            </View>
          }
          data={chatrooms}
          renderItem={({ item }) => {
            const name =
              realm.objectForPrimaryKey(
                "account",
                user._id == item.senderId
                  ? Realm.BSON.ObjectId(item.recieverId)
                  : Realm.BSON.ObjectId(item.senderId)
              ) ??
              realm.objectForPrimaryKey(
                "client",
                user._id == item.senderId
                  ? Realm.BSON.ObjectId(item.recieverId)
                  : Realm.BSON.ObjectId(item.senderId)
              );

            const chats = allChats.filtered(`roomId == $0`, item._id);
            const lastMessage = chats[chats.length - 1];

            return (
              <View id='SINGLE_CONTACT_MESSSAGE_BOX'>
                {lastMessage?.text ?? "" !== "" ? (
                  <View className='h-[8vh] px-[2vw]  items-center flex flex-row justify-between pt-[1vh]'>
                    <TouchableHighlight
                      className='rounded-md p-[1vw]'
                      underlayColor={"rgba(0,0,200,.2)"}
                      onPress={() => {
                        navigation.navigate("chats", {
                          roomId: item._id,
                        });
                      }}
                    >
                      <View className='w-[87vw] '>
                        <Text className=''>
                          {name?.name ? name.name : null}
                          {name?.clientId ? name.clientId : null}
                          {/* {name == ""
                            ? realm.objectForPrimaryKey(
                                "client",
                                Realm.BSON.ObjectId(lastMessage.user._id)
                              )?.clientId
                            : null} */}
                        </Text>
                        <Text className='' style={[styles.text_tiny]}>
                          {lastMessage.text}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                ) : null}
              </View>
            );
          }}
        />
        {visible && (
          <Motion.View
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            className='bg-emerald-300 h-[100vh] w-[70vw] pl-[3vw] pt-[1vh] absolute top-0 right-0'
          >
            <Text style={styles.text_md} className=' mt-[2vh] text-center'>
              Contacts
            </Text>
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
                      <Text style={styles.averageText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              data={contacts}
              keyExtractor={(item) => item._id}
            />
          </Motion.View>
        )}
        <TouchableOpacity
          id='OPEN_CONTACT_LIST'
          onPress={() => {
            setVisible(!visible);
          }}
          activeOpacity={0.4}
        >
          <View className='absolute bottom-[5vh] right-[5vw] bg-emerald-500 p-[3vw] rounded-full'>
            <AntDesign name='message1' size={24} color='black' />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Background>
  );
}
