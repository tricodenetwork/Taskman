import { View, Text } from "react-native";
import React from "react";
import { styles } from "../styles/stylesheet";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import Menu from "../components/Menu";
import { useDispatch } from "react-redux";
import { setMenu } from "../store/slice-reducers/Formslice";

export default function Taskman({ navigation }) {
  const dispatch = useDispatch();
  return (
    <Background>
      <Topscreen
        navigation={(e) => {
          navigation.navigate(e);
          dispatch(setMenu());
        }}
      />
      {/* <Menu /> */}
      <View className='flex-1'>
        <Text
          style={styles.text}
          className='absolute top-[50vh] bg-slate-300 z-0 rounded-3xl px-4 py-1  text-2xl text-primary self-center'
        >
          Taskman
        </Text>
      </View>
    </Background>
  );
}
