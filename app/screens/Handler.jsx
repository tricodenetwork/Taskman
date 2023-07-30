import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Background from "../components/Background";
import HandlerTopscreen from "../components/HandlerTopScreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import OptionsCard from "../components/OptionsCard";
import { FontAwesome5 } from "@expo/vector-icons";
import { formattedDate } from "../api/Functions";
import { activejob } from "../models/Task";
import { AccountRealmContext } from "../models";
import LowerButton from "../components/LowerButton";
import { useUser } from "@realm/react/";
import { useSelector } from "react-redux";
import { chatroom, chats as chat } from "../models/Chat";
import { useIsFocused } from "@react-navigation/native";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Handler({ navigation }) {
  const activeJobs = useQuery(activejob);
  const user = useUser();
  const [data, setData] = useState();
  const focus = useIsFocused();
  const { name, _id } = useSelector((state) => state.user);
  const chats = useQuery(chat);
  const chatrooms = useQuery("chatroom").filtered(
    "senderId == $0 ||  recieverId == $0",
    _id
  );
  useEffect(() => {
    // convert Realm collection to JavaScript array
    const chatroomsArray = Array.from(chatrooms);

    // create a map with the most recent createdAt dates for each room
    const lastDatesMap = new Map();
    chatroomsArray.forEach((room) => {
      const chatsForRoom = chats.filtered(`roomId == $0`, room._id);
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

    setData(sortedChatrooms);
  }, [focus]);
  const handleLogout = useCallback(() => {
    user?.logOut();
  }, [user]);

  function countTasksByStatus(tasksArray, handlerName) {
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let awaitingCount = 0;

    tasksArray.forEach((taskObj) => {
      taskObj.tasks.forEach((task) => {
        if (task.handler === handlerName) {
          if (task.status === "Completed") {
            completedCount++;
          } else if (task.status === "InProgress") {
            inProgressCount++;
          } else if (task.status === "Pending" || task.status === "") {
            pendingCount++;
          } else if (task.status === "Awaiting") {
            awaitingCount++;
          } else if (task.status === "Overdue") {
            overdueCount++;
          }
        }
      });
    });

    const addLeadingZero = (number) => {
      return number < 10 ? "0" + number : number;
    };

    return {
      completed: addLeadingZero(completedCount),
      inProgress: addLeadingZero(inProgressCount),
      pending: addLeadingZero(pendingCount),
      awaiting: addLeadingZero(awaitingCount),
      overdue: addLeadingZero(overdueCount),
    };
  }

  const handlerStats = countTasksByStatus(activeJobs, name);

  const userRooms = useQuery(chatroom)
    .filtered(`recieverId == $0 || senderId == $0`, _id)
    .map((params) => params._id)
    .filter(
      (roomId) =>
        chats.filtered(
          `status != "read" AND user._id != $0 AND roomId == $1`,
          _id,
          roomId
        ).length > 0
    );
  return (
    <Background bgColor='-z-40'>
      <HandlerTopscreen text3={formattedDate} text={`Hello, ${name}`}>
        <View className=' absolute bottom-[3vh] w-full  flex px-[5vw]'>
          <View className='w-full  flex flex-row justify-between'>
            <View className='relative'>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(48),
                    lineHeight: actuatedNormalizeVertical(78),
                  },
                ]}
                className='text-primary_light'
              >
                {handlerStats.awaiting}
              </Text>
              <View>
                <Text style={styles.text_md} className='flex text-white'>
                  Tasks
                </Text>
                <Text style={styles.text_md} className='text-white'>
                  Awaiting
                </Text>
              </View>
              <View
                style={{}}
                className={`bg-primary_light absolute w-[1px] opacity-40 rounded-full left-[25vw] top-[2.5vh] h-[90%]`}
              ></View>
            </View>
            <View className='relative'>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(48),
                    lineHeight: actuatedNormalizeVertical(78),
                  },
                ]}
                className='text-primary_light'
              >
                {handlerStats.inProgress}
              </Text>
              <View>
                <Text style={styles.text_md} className='flex text-white'>
                  Tasks
                </Text>
                <Text style={styles.text_md} className='text-white'>
                  In Progress
                </Text>
              </View>
              <View
                className={
                  "bg-primary_light absolute w-[1px] opacity-40 rounded-full left-[25vw] top-[2.5vh] h-[90%]"
                }
              ></View>
            </View>
            <View className='relative'>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(48),
                    lineHeight: actuatedNormalizeVertical(78),
                  },
                ]}
                className='text-primary_light'
              >
                {handlerStats.completed}
              </Text>
              <View>
                <Text
                  style={styles.text_md}
                  className='text-[14px] flex text-white'
                >
                  Tasks
                </Text>
                <Text style={styles.text_md} className='text-[14px] text-white'>
                  Completed
                </Text>
              </View>
            </View>
          </View>
          <View className='w-full  flex flex-row justify-between'>
            <View className='relative'>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(48),
                    lineHeight: actuatedNormalizeVertical(78),
                  },
                ]}
                className='text-primary_light'
              >
                {handlerStats.overdue}
              </Text>
              <View>
                <Text style={styles.text_md} className='flex text-white'>
                  Tasks
                </Text>
                <Text style={styles.text_md} className='text-white'>
                  Overdue
                </Text>
              </View>
              {/* <View
                style={{}}
                className={`bg-primary_light absolute w-[1px] opacity-40 rounded-full left-[25vw] top-[2.5vh] h-[90%]`}
              ></View> */}
            </View>
          </View>
        </View>
      </HandlerTopscreen>
      <View className='flex justify-between self-center  pt-[1.5vh]'>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("mytasks");
            }}
            activeOpacity={0.5}
          >
            <OptionsCard
              icon={
                <FontAwesome5
                  name='tasks'
                  size={actuatedNormalize(25)}
                  color='black'
                />
              }
              text={"Tasks"}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("profile");
            }}
            activeOpacity={0.5}
          >
            <OptionsCard
              icon={
                <FontAwesome5
                  name='user'
                  size={actuatedNormalize(25)}
                  color='black'
                />
              }
              text={"Profile"}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            className='relative max-h-max'
            onPress={() => {
              navigation.navigate("messages", { data: data });
            }}
            activeOpacity={0.5}
          >
            <OptionsCard
              icon={
                <FontAwesome5
                  name='rocketchat'
                  size={actuatedNormalize(25)}
                  color='black'
                />
              }
              text={"Messages"}
            />
            {userRooms.length !== 0 ? (
              <View
                style={{
                  width: actuatedNormalize(25),
                  height: actuatedNormalize(25),
                }}
                className='rounded-full absolute left-[15vw] top-[26%]   flex items-center justify-center bg-purple-500'
              >
                <Text
                  className='text-red-100'
                  style={[
                    styles.text_sm,
                    {
                      fontSize: actuatedNormalize(12),
                      lineHeight: actuatedNormalizeVertical(12 * 1.5),
                    },
                  ]}
                >
                  {userRooms.length}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
      <LowerButton
        style={"w-[90vw]"}
        navigate={handleLogout}
        text={"Log Out"}
      />
    </Background>
  );
}
