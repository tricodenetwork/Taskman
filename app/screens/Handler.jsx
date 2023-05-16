import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import HandlerTopscreen from "../components/HandlerTopScreen";
import { styles } from "../styles/stylesheet";
import Tasks from "../../assets/images/tasks.svg";
import Subtract from "../../assets/images/Subtract.svg";

export default function Handler({ navigation }) {
  return (
    <Background>
      <HandlerTopscreen
        text3={"Monday, 27 Jan 2023"}
        text={"Hello, Ovodo Ohwovoriole"}
        onPress={() => navigation.goBack()}
      >
        <View className='mt-[7vh] flex flex-row justify-between px-5'>
          <View className='relative'>
            <Text
              style={styles.text}
              className='text-primary_light mb-2 text-5xl'
            >
              08
            </Text>
            <View>
              <Text
                style={styles.text_md}
                className='text-[14px] flex text-white'
              >
                Tasks
              </Text>
              <Text style={styles.text_md} className='text-[14px] text-white'>
                Pending
              </Text>
            </View>
            <View
              style={{}}
              className={`bg-primary_light absolute w-[.5px] rounded-full left-[25vw] top-[3.5vh] h-[60%]`}
            ></View>
          </View>
          <View className='relative'>
            <Text
              style={styles.text}
              className='text-primary_light mb-2 text-5xl'
            >
              15
            </Text>
            <View>
              <Text
                style={styles.text_md}
                className='text-[14px] flex text-white'
              >
                Tasks
              </Text>
              <Text style={styles.text_md} className='text-[14px] text-white'>
                In Progress
              </Text>
            </View>
            <View
              style={{}}
              className={`bg-primary_light absolute w-[.5px] rounded-full left-[25vw] top-[3.5vh] h-[60%]`}
            ></View>
          </View>
          <View className=''>
            <Text
              style={styles.text}
              className='text-primary_light mb-2 text-5xl'
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
      <View className='px-5 border-2 relative bottom-[10vh] flex flex-row justify-between flex-wrap border-emerald-500 w-[full]  h-[55vh]'>
        <View className='bg-white p-4 rounded-2xl w-[48%]  h-[48%]'>
          <TouchableOpacity>
            <Subtract />
            <Tasks />
          </TouchableOpacity>
          <Text>My Tasks</Text>
          <Text>34 new tasks added</Text>
        </View>
        <View className='bg-white p-4 rounded-2xl w-[48%] h-[48%]'>
          <TouchableOpacity>
            <Subtract />
            <Tasks />
          </TouchableOpacity>
          <Text>My Tasks</Text>
          <Text>34 new tasks added</Text>
        </View>
        <View className='bg-white p-4 rounded-2xl w-[48%] h-[48%]'>
          <TouchableOpacity>
            <Subtract />
            <Tasks />
          </TouchableOpacity>
          <Text>My Tasks</Text>
          <Text>34 new tasks added</Text>
        </View>
        <View className='bg-white p-4 rounded-2xl w-[48%] h-[48%]'>
          <TouchableOpacity>
            <Subtract />
            <Tasks />
          </TouchableOpacity>
          <Text>My Tasks</Text>
          <Text>34 new tasks added</Text>
        </View>
      </View>
    </Background>
  );
}
