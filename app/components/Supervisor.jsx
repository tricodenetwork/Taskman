import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Background from "../components/Background";
import HandlerTopscreen from "../components/HandlerTopScreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import { useNavigation, useRoute } from "@react-navigation/native";
import OptionsCard from "./OptionsCard";
import { FontAwesome5 } from "@expo/vector-icons";
import LowerButton from "./LowerButton";
import { AccountRealmContext } from "../models";
import { useSelector } from "react-redux";
import { formattedDate } from "../api/Functions";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Supervisor() {
  // prettier-ignore
  //   -------------------------------------------------------------------------VARIABLES AND STATES
  const route = useRoute();
  const navigation = useNavigation();
  const realm = useRealm();
  const { id } = useSelector((state) => state.user);
  const account = useObject("account", Realm.BSON.ObjectId(id));

  return (
    <Background>
      <HandlerTopscreen text3={formattedDate} text={`Hello, ${account?.name}`}>
        <View className=' absolute bottom-[12vh]  w-full  flex flex-row justify-between px-[5vw]'>
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
              08
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
              15
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
              29
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
      <View className='absolute self-center pt-[3vh] top-[52vh]'>
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
        <TouchableOpacity activeOpacity={0.5}>
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
      <LowerButton text={"Log Out"} />
    </Background>
  );
}
