import { View, Text } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import Constants from "expo-constants";

export default function Taskman({ navigation }) {
  // const users = Realm.objects("Account");
  // console.log(new Realm.BSON.ObjectId());
  console.log(Constants.systemFonts);

  return (
    <Background>
      <Topscreen />
      {/* <Menu /> */}
      <View className='flex-1 z-10'>
        <Text
          style={[styles.text, { fontSize: actuatedNormalize(18) }]}
          className='absolute top-[50vh] bg-slate-300 z-0 rounded-3xl px-4 py-1  text-2xl text-primary self-center'
        >
          Taskman
        </Text>
      </View>
    </Background>
  );
}
