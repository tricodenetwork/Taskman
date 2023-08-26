import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";

function OdinaryButton({ navigate, text, style, disabled, bg, color }) {
  return (
    <View
      style={{ backgroundColor: disabled ? "slategray" : bg ? bg : "purple" }}
      // style={{ backgroundColor: bg ? bg : "rgb(88 28 135)" }}
      className={` ${style}  self-center  rounded-md  mx-auto`}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={navigate}
        className='self-center disabled:bg-slate-400 rounded-lg px-[5vw] py-[1vh]'
      >
        <Text
          style={[
            styles.text_md2,
            {
              fontSize: actuatedNormalize(13),
              color: disabled |!color ? "white" : color && color,
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

export default React.memo(OdinaryButton);
