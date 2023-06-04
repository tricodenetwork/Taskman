import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";

export default function OdinaryButton({ navigate, text, style,disabled }) {
  return (
    <View className={` ${style}  self-center rounded-sm  mx-auto`}>
      <TouchableOpacity
      disabled={disabled}
        onPress={navigate}
        className='bg-[] self-center rounded-lg px-[5vw] py-[1vh]'
      >
        <Text
          style={[styles.text_md2, { fontSize: actuatedNormalize(13) }]}
          className='font-extrabold text-center text-slate-300'
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
