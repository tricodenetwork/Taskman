import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect } from "react";
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

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Supervisor() {
  // prettier-ignore
  //   -------------------------------------------------------------------------VARIABLES AND STATES
  const route = useRoute();
  const user = useUser();
  const navigation = useNavigation();
  const realm = useRealm();
  const { id, name } = useSelector((state) => state.user);
  // const account = useObject("account", Realm.BSON.ObjectId(id));
  const activeJobs = useQuery(activejob);
  const handleLogout = useCallback(() => {
    user?.logOut();
  }, [user]);

  function updateJobStatus(supervisorName) {
    realm.write(() => {
      activeJobs.forEach((activejob) => {
        if (activejob.supervisor !== supervisorName) {
          return;
        }
        let jobstatus = "Pending";
        let allTasksCompleted = true;

        activejob.job.tasks.forEach((task) => {
          if (task.status == "InProgress" || task.status == "Completed") {
            jobstatus = "InProgress";
            // InProgress = true;
            return;
          } else if (task.status !== "InProgress" || task.status == "Pending") {
            allTasksCompleted = false;
            // InProgress = true;
          }
        });
        if (allTasksCompleted) {
          jobstatus = "Completed";
        }

        activejob.status = jobstatus;
      });
    });
  }

  function countStatusBySupervisor(dataArray, supervisorName) {
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;

    dataArray.forEach((dataObj) => {
      if (dataObj.supervisor === supervisorName) {
        if (dataObj.status === "Completed") {
          completedCount++;
        } else if (dataObj.status === "InProgress") {
          inProgressCount++;
        } else if (dataObj.status === "Pending") {
          pendingCount++;
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
    };
  }

  const supervisorStats = countStatusBySupervisor(activeJobs, name);

  useEffect(() => {
    updateJobStatus(name);
  }, []);

  return (
    <Background bgColor='min-h-[96vh]'>
      <HandlerTopscreen text3={formattedDate} text={`Hello, ${name}`}>
        <View className=' absolute bottom-[12vh]  w-full  flex flex-row justify-between px-[5vw]'>
          <View className='relative'>
            <Text
              style={[
                styles.text,
                {
                  fontSize: actuatedNormalize(44),
                  lineHeight: actuatedNormalizeVertical(78),
                },
              ]}
              className='text-primary_light'
            >
              {supervisorStats.pending}
            </Text>
            <View>
              <Text style={styles.text_md} className='flex text-white'>
                {route.name === "supervisor" ? "Jobs" : "Tasks"}
              </Text>
              <Text style={styles.text_md} className='text-white'>
                Pending
              </Text>
            </View>
            <View
              className={`bg-primary_light absolute w-[1px] opacity-40 rounded-full left-[25vw] top-[3.5vh] h-[60%]`}
            ></View>
          </View>
          <View className='relative'>
            <Text
              style={[
                styles.text,
                {
                  fontSize: actuatedNormalize(44),
                  lineHeight: actuatedNormalizeVertical(78),
                },
              ]}
              className='text-primary_light'
            >
              {supervisorStats.inProgress}
            </Text>
            <View>
              <Text style={styles.text_md} className='flex text-white'>
                {route.name === "supervisor" ? "Jobs" : "Tasks"}
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
          <View className='relative'>
            <Text
              style={[
                styles.text,
                {
                  fontSize: actuatedNormalize(44),
                  lineHeight: actuatedNormalizeVertical(78),
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
                {route.name === "supervisor" ? "Jobs" : "Tasks"}
              </Text>
              <Text style={styles.text_md} className='text-[14px] text-white'>
                Completed
              </Text>
            </View>
          </View>
        </View>
      </HandlerTopscreen>
      <View className='self-center pt-[3vh]'>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("activeJobs");
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
              text={"Jobs"}
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
      <LowerButton
        style={"w-[90vw]"}
        navigate={handleLogout}
        text={"Log Out"}
      />
    </Background>
  );
}
