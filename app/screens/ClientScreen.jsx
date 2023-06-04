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

export default function ClientScreen() {
  // prettier-ignore
  //   -------------------------------------------------------------------------VARIABLES AND STATES
  const route = useRoute();
  const user = useUser();
  const navigation = useNavigation();
  const realm = useRealm();
  const { _id } = useSelector((state) => state.user);
  // const account = useObject("account", Realm.BSON.ObjectId(id));
  // const activeJobs = useQuery(activejob);
  const handleLogout = useCallback(() => {
    user?.logOut();
  }, [user]);

  return (
    <Background>
      <HandlerTopscreen text3={formattedDate} text={`Hello, ${_id}`}>
        {/* <View className=' absolute bottom-[12vh]  w-full  flex flex-row justify-between px-[5vw]'>
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
        </View> */}
      </HandlerTopscreen>
      <View className='absolute self-center pt-[3vh] top-[49vh]'>
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
              text={"Job"}
            />
          </TouchableOpacity>
        </View>

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
      <LowerButton navigate={handleLogout} text={"Log Out"} />
    </Background>
  );
}
