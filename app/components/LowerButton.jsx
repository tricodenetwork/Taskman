import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/stylesheet";

const LowerButton = ({ text, navigate, disabled }) => {
  return (
    <View className='absolute bottom-[1vh] self-center  mx-auto'>
      <TouchableOpacity
        style={{ opacity: disabled ? 0.5 : 1 }}
        disabled={disabled}
        onPress={navigate}
        className='bg-slate-900 self-center rounded-lg w-[90vw] py-2'
      >
        <Text style={styles.text_md2} className='text-center text-slate-100'>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LowerButton;
