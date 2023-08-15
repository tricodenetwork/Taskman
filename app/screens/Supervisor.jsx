import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Background from "../components/Background";
import HandlerTopscreen from "../components/HandlerTopScreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import { useNavigation, useRoute } from "@react-navigation/native";
import OptionsCard from "../components/OptionsCard";
import { FontAwesome5 } from "@expo/vector-icons";
import LowerButton from "../components/LowerButton";
import { AccountRealmContext } from "../models";
import { useSelector } from "react-redux";
import { formattedDate } from "../api/Functions";
import { activejob } from "../models/Task";
import { useUser } from "@realm/react";
import { chats as chat, chatroom } from "../models/Chat";
import { useIsFocused } from "@react-navigation/native";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Supervisor() {
  // prettier-ignore
  //   -------------------------------------------------------------------------VARIABLES AND STATES
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(true);

  const user = useUser();
  const navigation = useNavigation();
  const realm = useRealm();
  const [data, setData] = useState();

  const { _id, name } = useSelector((state) => state.user);
  // const account = useObject("account", Realm.BSON.ObjectId(id));
  const activeJobs = useQuery(activejob);
  const chats = useQuery(chat);
  const focus = useIsFocused();
  const chatrooms = useQuery("chatroom").filtered(
    "senderId == $0 ||  recieverId == $0",
    _id
  );
  // const allChats = useQuery(chats);

  const handleLogout = useCallback(() => {
    user?.logOut();
  }, [user]);

  function countStatusBySupervisor(dataArray, supervisorName) {
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let awaitingCount = 0;
    let totalCount = 0;

    dataArray.forEach((dataObj) => {
      if (dataObj.supervisor === supervisorName) {
        totalCount++;

        if (dataObj.status === "Completed") {
          completedCount++;
        } else if (dataObj.status === "InProgress") {
          inProgressCount++;
        } else if (dataObj.status === "Pending") {
          pendingCount++;
        } else if (dataObj.status === "Awaiting") {
          awaitingCount++;
        } else if (dataObj.status === "Overdue") {
          overdueCount++;
        }
      }
    });

    // Function to add leading zero if number is single digit
    const addLeadingZero = (number) => {
      return number < 10 ? "0" + number : number;
    };

    return {
      completed: addLeadingZero(completedCount),
      inProgress: addLeadingZero(inProgressCount),
      pending: addLeadingZero(pendingCount),
      awaiting: addLeadingZero(awaitingCount),
      overdue: addLeadingZero(overdueCount),
      total: addLeadingZero(totalCount),
    };
  }

  const supervisorStats = countStatusBySupervisor(activeJobs, name);
  // console.log(_id);
  // Create rooms where user is present and filter for incoming messages that hasnt been read
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
    <Background bgColor='min-h-[96vh]'>
      <HandlerTopscreen text3={formattedDate} text={`Hello, ${name}`}>
        <View className=' absolute bottom-[3vh] space-y-3  w-full self-center  flex  px-[5vw]'>
          <View className='w-full space-x-[25vw]  flex flex-row justify-between'>
            <View className='relative flex-1 '>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(36),
                    lineHeight: actuatedNormalizeVertical(36 * 1.5),
                  },
                ]}
                className='text-primary_light'
              >
                {supervisorStats.pending}
              </Text>
              <View>
                <Text style={styles.text_md} className='flex text-white'>
                  Jobs
                </Text>
                <Text style={styles.text_md} className='text-white'>
                  Pending
                </Text>
              </View>
              <View
                className={`bg-primary_light absolute w-[1px] opacity-40 rounded-full left-[25vw] top-[3.5vh] h-[60%]`}
              ></View>
            </View>
            <View className='relative flex-1 '>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(36),
                    lineHeight: actuatedNormalizeVertical(36 * 1.5),
                  },
                ]}
                className='text-primary_light'
              >
                {supervisorStats.inProgress}
              </Text>
              <View>
                <Text style={styles.text_md} className='flex text-white'>
                  Jobs
                </Text>
                <Text style={styles.text_md} className='text-white'>
                  In Progress
                </Text>
              </View>
              <View
                className={
                  "bg-primary_light absolute w-[1px] opacity-40 rounded-full left-[25vw] top-[3.5vh] h-[60%]"
                }
              ></View>
            </View>
            <View className='relative flex-1 '>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(36),
                    lineHeight: actuatedNormalizeVertical(36 * 1.5),
                  },
                ]}
                className='text-primary_light'
              >
                {supervisorStats.completed}
              </Text>
              <View>
                <Text
                  style={styles.text_md}
                  className='text-[14px] flex text-white'
                >
                  Jobs
                </Text>
                <Text style={styles.text_md} className='text-[14px] text-white'>
                  Completed
                </Text>
              </View>
            </View>
          </View>
          <View className='w-full space-x-[25vw] flex  flex-row justify-between'>
            <View className='relative flex-1 '>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(36),
                    lineHeight: actuatedNormalizeVertical(36 * 1.5),
                  },
                ]}
                className='text-primary_light'
              >
                {supervisorStats.awaiting}
              </Text>
              <View>
                <Text
                  style={styles.text_md}
                  className='text-[14px] flex text-white'
                >
                  Jobs
                </Text>
                <Text style={styles.text_md} className='text-[14px] text-white'>
                  Awaiting
                </Text>
              </View>
              <View
                className={
                  "bg-primary_light absolute w-[1px] opacity-40 rounded-full left-[25vw] top-[3.5vh] h-[60%]"
                }
              ></View>
            </View>
            <View className='relative flex-1 '>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(36),
                    lineHeight: actuatedNormalizeVertical(36 * 1.5),
                  },
                ]}
                className='text-primary_light'
              >
                {supervisorStats.overdue}
              </Text>
              <View>
                <Text
                  style={styles.text_md}
                  className='text-[14px] flex text-white'
                >
                  Jobs
                </Text>
                <Text style={styles.text_md} className='text-[14px] text-white'>
                  Overdue
                </Text>
              </View>
              <View
                className={
                  "bg-primary_light absolute w-[1px] opacity-40 rounded-full left-[25vw] top-[3.5vh] h-[60%]"
                }
              ></View>
            </View>
            <View className='relative flex-1'>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: actuatedNormalize(36),
                    lineHeight: actuatedNormalizeVertical(36 * 1.5),
                  },
                ]}
                className='text-primary_light'
              >
                {supervisorStats.total}
              </Text>
              <View>
                <Text
                  style={styles.text_md}
                  className='text-[14px] flex text-white'
                >
                  Total
                </Text>
                <Text style={styles.text_md} className='text-[14px] text-white'>
                  Jobs
                </Text>
              </View>
            </View>
          </View>
        </View>
      </HandlerTopscreen>
      <View className='self-center flex justify-between h-[40vh] py-[2.5vh]'>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("activeJobs");
            }}
            activeOpacity={0.9}
            className='rounded-md bg-primary'
          >
            <OptionsCard
              icon={
                <FontAwesome5
                  name='tasks'
                  size={actuatedNormalize(25)}
                  color='black'
                />
              }
              text={"Jobs"}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("profile");
          }}
          activeOpacity={0.9}
          className='rounded-md bg-primary'
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
        <TouchableOpacity
          className='relative flex flex-row max-h-max'
          onPress={() => {
            navigation.navigate("messages");
          }}
          activeOpacity={0.9}
          className='rounded-md bg-primary'
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
              className='rounded-full absolute left-[15vw] self-center   flex items-center justify-center bg-purple-500'
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
      <LowerButton
        style={"w-[90vw]"}
        navigate={handleLogout}
        text={"Log Out"}
      />
    </Background>
  );
}
