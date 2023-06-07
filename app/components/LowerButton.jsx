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
    <View className='absolute bottom-[2%] self-center  mx-auto'>
      {
        <TouchableOpacity
          style={{ opacity: disabled ? 0.5 : 1 }}
          disabled={disabled}
          onPress={navigate}
          className={`bg-slate-900 ${style} self-center rounded-lg w-[90vw] py-2`}
        >
          <Text style={styles.text_md2} className={`text-center ${textStyle}`}>
            {text}
          </Text>
        </TouchableOpacity>
      }
    </View>
  );
};

export default LowerButton;
