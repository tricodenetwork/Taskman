import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";

export default function OdinaryButton({ navigate, text, style }) {
  return (
    <View className={` ${style}  self-center  mx-auto`}>
      <TouchableOpacity
        onPress={navigate}
        className='bg-[#E59F71] self-center rounded-md px-[5vw] py-[1vh]'
      >
        <Text
          style={[styles.text_md2, { fontSize: actuatedNormalize(13) }]}
          className='font-extrabold text-center text-slate-900'
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
