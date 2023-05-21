import { View, Text } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import Menu from "../components/Menu";
import { useDispatch } from "react-redux";
import { setMenu } from "../store/slice-reducers/Formslice";
import Realm from "realm";

export default function Taskman({ navigation }) {
  const dispatch = useDispatch();

  // const users = Realm.objects("Account");
  // console.log(users);
  return (
    <Background>
      <Topscreen
        navigation={(e) => {
          navigation.navigate(e);
          dispatch(setMenu());
        }}
      />
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
