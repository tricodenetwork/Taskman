import { View, Text, FlatList, Animated, Modal } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Background from "../components/Background";
import SelectComponent from "../components/SelectComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { AccountRealmContext } from "../models";
import { Account } from "../models/Account";
import { addChat, deleteChat } from "../store/slice-reducers/ChatSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  SCREEN_HEIGHT,
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import { chatroom, chats, user } from "../models/Chat";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Motion } from "@legendapp/motion";
import { activejob } from "../models/Task";
import { Ionicons } from "@expo/vector-icons";

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
  const renderItem = ({ item }) => {
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
    const unread = chats.filtered(`status !="read"`).filtered(
      `user._id != 
            $0`,
      user._id
    );
    const lastMessage = chats[chats.length - 1];
    // console.log(unread);

    return (
      <View id='SINGLE_CONTACT_MESSSAGE_BOX'>
        {lastMessage?.text ?? "" !== "" ? (
          <View className='h-[8vh]   px-[2vw]  items-center flex flex-row justify-between pt-[1vh]'>
            <TouchableHighlight
              className='rounded-md'
              underlayColor={"rgba(0,0,200,.2)"}
              onPress={() => {
                navigation.navigate("chats", {
                  roomId: item._id,
                  name: name.name,
                });
              }}
            >
              <View className=''>
                <Text
                  className=' my-auto'
                  style={{
                    fontSize: actuatedNormalize(14),
                    lineHeight: actuatedNormalizeVertical(14 * 1.5),
                  }}
                >
                  {name?.name ? name.name : null}
                  {name?.clientId ? name.clientId : null}
                  {/* {name == ""
                            ? realm.objectForPrimaryKey(
                                "client",
                                Realm.BSON.ObjectId(lastMessage.user._id)
                              )?.clientId
                            : null} */}
                </Text>
                <View className='flex relative w-[87vw] items-center space-x-1 mt-1 max-w-max flex-row'>
                  {lastMessage.user._id == user._id ? (
                    <Ionicons
                      name='checkmark-done'
                      size={actuatedNormalize(16)}
                      color={
                        lastMessage.status == "read"
                          ? "rgb(168 85 247)"
                          : "gray"
                      }
                    />
                  ) : (
                    <Ionicons
                      name='checkmark-done'
                      size={actuatedNormalize(16)}
                      color={"transparent"}
                    />
                  )}

                  <Text
                    className='font-light'
                    style={{
                      fontSize: actuatedNormalize(12),
                      lineHeight: actuatedNormalizeVertical(12 * 1.5),
                    }}
                  >
                    {lastMessage.text}
                  </Text>
                  {unread.length !== 0 ? (
                    <View
                      style={{
                        width: actuatedNormalize(15),
                        height: actuatedNormalize(15),
                      }}
                      className='rounded-full  absolute right-2 flex items-center justify-center bg-purple-500'
                    >
                      <Text
                        className='text-red-100'
                        style={[
                          styles.text_sm,
                          {
                            fontSize: actuatedNormalize(8),
                            lineHeight: actuatedNormalizeVertical(8 * 1.5),
                          },
                        ]}
                      >
                        {unread.length}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </TouchableHighlight>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <Background>
      <SafeAreaView className='relative bottom-0 bg-red-100 flex-1 w-full h-full'>
        {/* <SelectComponent title={"Add"} /> */}
        <FlatList
          className='-mt-2'
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            <View>
              <Text
                style={[styles.text, { fontSize: actuatedNormalize(17) }]}
                className='px-[2vw] text-primary'
              >
                Chats
              </Text>
            </View>
          }
          data={chatrooms}
          renderItem={renderItem}
        />
        <View
          className={`absolute z-50 bottom-[5vh] right-[5vw] ${
            !visible ? "bg-purple-500" : "bg-white"
          } p-[3vw] rounded-full`}
        >
          <TouchableOpacity
            id='OPEN_CONTACT_LIST'
            onPress={() => {
              setVisible(!visible);
            }}
            activeOpacity={0.4}
          >
            <AntDesign
              name='message1'
              size={24}
              color={visible ? "black" : "white"}
            />
          </TouchableOpacity>
        </View>

        {visible ? (
          <Motion.View
            // style={{ transform: [{ translateX: slideAnimation }] }}
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 20, duration: 0.1 }}
            className='bg-purple-500 z-10 h-[100vh] rounded-sm shadow-sm shadow-slate-500 w-[70vw] pl-[3vw] pt-[1vh] absolute top-0 right-0'
          >
            {/* <Text
              style={styles.text_md2}
              className=' mt-[2vh] text-red-100 text-center'
            >
              Contacts
            </Text> */}

            <FlatList
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      const roomId = createChatRoom(item._id.toHexString());
                      navigation.navigate("chats", {
                        roomId: roomId,
                        name: item.name,
                      });
                      setVisible(!visible);
                    }}
                  >
                    <View className='h-[10vh] text-red-100 pt-[3vh]'>
                      <Text className='text-red-100' style={styles.averageText}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              data={contacts}
              keyExtractor={(item) => item._id}
            />
          </Motion.View>
        ) : null}
      </SafeAreaView>
    </Background>
  );
}
