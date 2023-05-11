import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/stylesheet";

const LowerButton = ({ text, navigate, disabled }) => {
  return (
    <View className='absolute bottom-[2%] self-center  mx-auto'>
      <TouchableOpacity
        style={{ opacity: disabled ? 0.5 : 1 }}
        disabled={disabled}
        onPress={navigate}
        className='bg-[#77E6B6] self-center rounded-2xl w-[90vw]  px-8 py-3'
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
};

export default LowerButton;
