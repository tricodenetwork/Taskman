import React from "react";
import { View, Text } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { styles } from "../styles/stylesheet";

const TapCard = ({ text }) => {
  return (
    <View className='bg-white flex-row rounded-sm  w-[90vw] h-[10vh] px-[5vw] items-center justify-between'>
      <Text style={styles.text_md} className='text-xl'>
        {text}
      </Text>
      <Fontisto name='angle-right' size={30} color='black' />
    </View>
  );
};

export default TapCard;
