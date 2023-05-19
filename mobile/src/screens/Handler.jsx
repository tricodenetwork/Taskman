import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import HandlerTopscreen from "../components/HandlerTopScreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import Tasks from "../../assets/images/tasks.svg";
import Subtract from "../../assets/images/Subtract.svg";
import Box from "../../assets/images/Box.svg";

export default function Handler() {
  return (
    <Background>
      <HandlerTopscreen
        text3={"Monday, 27 Jan 2023"}
        text={"Hello, Ovodo Ohwovoriole"}
        onPress={() => navigation.goBack()}
      >
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
              08
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
              15
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
              29
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
      {/* <View className='px-4  relative bottom-[10vh] flex flex-row justify-between flex-wrap border-emerald-500 w-[full]  h-[55vh]'>
        <View
          style={styles.Pcard}
          className='bg-white mb-[2vh] p-4 rounded-2xl  w-[100%]  h-[15vh]'
        >
          <Text style={styles.text} className='text-primary text-lg'>
            My Task
          </Text>
          <Text style={styles.text_md2} className='text-sm text-primary'>
            34<Text style={styles.text_sm}> new tasks added</Text>
          </Text>
        </View>
        <View
          style={styles.Pcard}
          className='bg-white mb-[2vh] p-4 rounded-2xl  w-[100%]  h-[15vh]'
        >
          <Text style={styles.text} className='text-primary text-lg'>
            My Profile
          </Text>
          <Text style={styles.text_sm} className='text-sm text-primary'>
            Ovodo Ohwovoriole
          </Text>
        </View>
        <View
          style={styles.Pcard}
          className='bg-white mb-[2vh] p-4 rounded-2xl  w-[100%]  h-[15vh]'
        >
          <Text style={styles.text} className='text-primary text-lg'>
            Chats
          </Text>
          <Text style={styles.text_sm} className='text-sm text-primary'>
            You have <Text style={styles.text}>2</Text> unread messages
          </Text>
        </View>
      </View> */}
    </Background>
  );
}
