import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/stylesheet";

const LowerButton = ({
  text,
  navigate,
  disabled,
  style,
  textStyle = " text-slate-200",
}) => {
  return (
    <View className={`absolute bottom-[1%] ${style} self-center  mx-auto`}>
      {
        <TouchableOpacity
          style={{ opacity: disabled ? 0.5 : 1 }}
          disabled={disabled}
          onPress={navigate}
          className={`bg-[#77e6b6] ${style} self-center h-[6vh]  flex justify-center rounded-lg py-[1vh]`}
        >
          <Text style={[styles.text_md]} className={`text-center text-Blue`}>
            {text}
          </Text>
        </TouchableOpacity>
      }
    </View>
  );
};

export default LowerButton;
