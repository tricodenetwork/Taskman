import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Background from "../../components/Background";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { AccountRealmContext } from "../../models";
import { Account } from "../../models/Account";
import { useSelector } from "react-redux";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../../styles/stylesheet";
import { chats } from "../../models/Chat";
import { FlatList } from "react-native-gesture-handler";
import { Motion } from "@legendapp/motion";
import { activejob } from "../../models/Task";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import useActions from "../../hooks/useActions";

const { useRealm, useQuery } = AccountRealmContext;

export default function MessageScreen({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatroom, setChatroom] = useState([]);
  const [showdelete, setShowdelete] = useState(false);
  const [id, setId] = useState("");
  const focus = useIsFocused();

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
  const { createChatRoom } = useActions();

  const renderItem = ({ item }, navigation, user, allChats, realm) => {
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
          <TouchableHighlight
            className='rounded-md'
            underlayColor={"rgba(0,0,200,.2)"}
            onPress={() => {
              // Only navigate if showdelete is false
              navigation.navigate("chats", {
                roomId: item._id,
                name: name?.name || name.clientId,
              });
            }}
            onLongPress={() => {
              setShowdelete(!showdelete);
              setId(item._id);
            }}
          >
            <View className='h-[8vh]   px-[2vw]  items-center flex flex-row justify-between pt-[1vh]'>
              <View className=''>
                <View className='flex justify-between flex-row'>
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
                </View>
                <View className='flex relative w-[87vw]  items-center space-x-1 mt-1 max-w-max flex-row'>
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
                    className='font-light flex flex-row truncate flex-wrap w-[83vw]'
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
                      className='rounded-full  absolute -right-4 flex items-center justify-center bg-purple-500'
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
            </View>
          </TouchableHighlight>
        ) : null}
      </View>
    );
  };
  const renderItemProps = ({ item }) =>
    renderItem({ item }, navigation, user, allChats, realm);

  const renderItem2 = ({ item }) => {
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
  };

  const deleteChat = useCallback(() => {
    const room = realm.objectForPrimaryKey("chatroom", id);
    setIsLoading(true);
    realm.write(() => {
      realm.delete(room);
    });
    setId("");
  }, [realm, chatrooms.length, isLoading, id]);

  useEffect(() => {
    setTimeout(() => {
      // convert Realm collection to JavaScript array
      const chatroomsArray = Array.from(chatrooms);

      // create a map with the most recent createdAt dates for each room
      const lastDatesMap = new Map();
      chatroomsArray.forEach((room) => {
        const chatsForRoom = allChats.filtered(`roomId == $0`, room._id);
        const lastMessage = chatsForRoom.sorted("createdAt", true)[0];
        lastDatesMap.set(room._id, lastMessage?.createdAt);
      });

      // sort chatrooms by most recent message's createdAt date
      const sortedChatrooms = chatroomsArray.sort((a, b) => {
        const lastDateA = lastDatesMap.get(a._id);
        const lastDateB = lastDatesMap.get(b._id);

        if (lastDateA > lastDateB) {
          return -1;
        } else if (lastDateA < lastDateB) {
          return 1;
        } else {
          return 0;
        }
      });
      setChatroom(sortedChatrooms);
      setIsLoading(false);
    }, 0);
  }, [focus, chatrooms.length, isLoading]);

  return (
    <Background>
      <SafeAreaView className='relative bg-red-100 w-full h-full'>
        {isLoading ? (
          <View className='relative bg-primary_light w-[35%] self-center flex items-center justify-between rounded- py-[2vh] top-[5vh]'>
            <ActivityIndicator size={"small"} color={"rgb(13 3 122)"} />
            <Text className='text-Blue relative top-2' style={styles.text_sm}>
              Loading...
            </Text>
          </View>
        ) : (
          <>
            <View className='absolute top-0 w-[100vw]'>
              {!showdelete ? (
                <View className='relative w-[20%]'>
                  <Text
                    style={[styles.text, { fontSize: actuatedNormalize(17) }]}
                    className='px-[2vw] text-primary'
                  >
                    Chats
                  </Text>
                  <View
                    className={`bg-primary absolute w-[80%]  rounded-full self-center bottom-[-2px] h-[2.5px]`}
                  ></View>
                </View>
              ) : (
                <Motion.View
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 200, duration: 0.1 }}
                  className='w-full h-[5vh] bg-primary '
                >
                  (
                  <TouchableOpacity
                    onPress={() => {
                      setShowdelete(!showdelete);
                      deleteChat();
                    }}
                  >
                    <View className='flex flex-row justify-center items-center'>
                      <Text
                        style={[
                          styles.text,
                          { fontSize: actuatedNormalize(17) },
                        ]}
                        className='px-[2vw] text-Secondary'
                      >
                        Delete
                      </Text>
                      <Ionicons
                        name='close'
                        size={actuatedNormalize(16)}
                        color={"green"}
                      />
                    </View>
                  </TouchableOpacity>
                  )
                </Motion.View>
              )}
            </View>
            <FlatList
              initialNumToRender={20}
              removeClippedSubviews={true} // Add this line.
              className='mt-10'
              keyExtractor={(item) => item._id}
              data={chatroom}
              renderItem={renderItemProps}
            />
          </>
        )}
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
            transition={{ type: "spring", stiffness: 20 }}
            className='bg-purple-500  h-[100vh] rounded-sm  w-[70vw] pl-[3vw] pt-[1vh] absolute top-0 right-0'
          >
            {/* <Text
              style={styles.text_md2}
              className=' mt-[2vh] text-red-100 text-center'
            >
              Contacts
            </Text> */}

            <FlatList
              // style={{ height: 300, borderWidth: 2 }}
              initialNumToRender={10}
              removeClippedSubviews={true} // Add this line.
              renderItem={renderItem2}
              data={contacts}
              keyExtractor={(item) => item._id}
            />
          </Motion.View>
        ) : null}
      </SafeAreaView>
    </Background>
  );
}
