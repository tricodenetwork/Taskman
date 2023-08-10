import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";

export default function OdinaryButton({
  navigate,
  text,
  style,
  disabled,
  bg,
  color,
}) {
  return (
    <View
      // style={{ backgroundColor: bg ? bg : "rgb(88 28 135)" }}
      className={` ${style} ${
        disabled ? "bg-slate-500" : bg ? `bg-[${bg}]` : "bg-purple-900"
      }  self-center  rounded-md  mx-auto`}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={navigate}
        className='self-center disabled:bg-slate-700 rounded-lg px-[5vw] py-[1vh]'
      >
        <Text
          style={[
            styles.text_md2,
            {
              fontSize: actuatedNormalize(13),
              color: color ? color : "white",
            },
          ]}
          className='text-center text-white'
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
