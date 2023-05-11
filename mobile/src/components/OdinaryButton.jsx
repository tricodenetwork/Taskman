import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../styles/stylesheet";

export default function OdinaryButton({ navigate, text, style }) {
  return (
    <View className={` ${style}  self-center  mx-auto`}>
      <TouchableOpacity
        onPress={navigate}
        className='bg-[#77E6B6] self-center rounded-2xl   px-8 py-3'
      >
        <Text
          style={styles.text_md2}
          className='font-extrabold text-center text-Blue'
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
