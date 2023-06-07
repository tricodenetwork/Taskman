import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
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

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Handler({ navigation }) {
  const activeJobs = useQuery(activejob);
  const user = useUser();
  const { name } = useSelector((state) => state.user);
  const handleLogout = useCallback(() => {
    user?.logOut();
  }, [user]);

  function countTasksByStatus(tasksArray, handlerName) {
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;

    tasksArray.forEach((taskObj) => {
      taskObj.job?.tasks.forEach((task) => {
        if (task.handler === handlerName) {
          if (task.status === "Completed") {
            completedCount++;
          } else if (task.status === "InProgress") {
            inProgressCount++;
          } else if (task.status === "Pending") {
            pendingCount++;
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
    };
  }

  const handlerStats = countTasksByStatus(activeJobs, name);
  return (
    <Background bgColor='-z-40'>
      <HandlerTopscreen text3={formattedDate} text={`Hello, ${name}`}>
        <View className=' absolute bottom-[12vh] w-full  flex flex-row justify-between px-[5vw]'>
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
              {handlerStats.pending}
            </Text>
            <View>
              <Text style={styles.text_md} className='flex text-white'>
                Tasks
              </Text>
              <Text style={styles.text_md} className='text-white'>
                Pending
              </Text>
            </View>
            <View
              style={{}}
              className={`bg-primary_light absolute w-[.5px] opacity-40 rounded-full left-[25vw] top-[3.5vh] h-[60%]`}
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
                "bg-primary_light absolute w-[.5px] opacity-40 rounded-full left-[25vw] top-[3.5vh] h-[60%]"
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
      </HandlerTopscreen>
      <View className='absolute self-center pt-[3vh] top-[49vh]'>
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("messages");
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
        </TouchableOpacity>
      </View>
      <LowerButton navigate={handleLogout} text={"Logout"} />
    </Background>
  );
}
