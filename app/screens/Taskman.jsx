import { View, Text } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Taskman({ navigation }) {
  // const users = Realm.objects("Account");
  // console.log(new Realm.BSON.ObjectId());
  console.log(Constants.systemFonts);

  return (
    <Background bgColor='-z-40'>
      <Topscreen />
      {/* <Menu /> */}
      <View className='flex-1 px-[3vw] pt-[3vh] -z-40'>
        <Text className='text-primary' style={[styles.text_sm]}>
          With organisational Task Manager, you can remotely...
        </Text>

        <View className='mt-[5vh] h-[30vh] flex justify-around'>
          <Text style={[styles.text_tiny, { fontSize: actuatedNormalize(14) }]}>
            * Set time target for tasks
          </Text>
          <Text style={[styles.text_tiny, { fontSize: actuatedNormalize(14) }]}>
            * Record tasks history
          </Text>
          <Text style={[styles.text_tiny, { fontSize: actuatedNormalize(14) }]}>
            * Supervise tasks among handlers
          </Text>
          <Text style={[styles.text_tiny, { fontSize: actuatedNormalize(14) }]}>
            * Evaluate handlers performance
          </Text>
          <Text style={[styles.text_tiny, { fontSize: actuatedNormalize(14) }]}>
            * Give feedback to clients
          </Text>
        </View>

        <Text
          style={[styles.text, { fontSize: actuatedNormalize(18) }]}
          className='absolute bottom-[5vh] bg-slate-300 -z-40 rounded-3xl px-4 py-1  text-2xl text-primary self-center'
        >
          Taskman
        </Text>
      </View>
    </Background>
  );
}
