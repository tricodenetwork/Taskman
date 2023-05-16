import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";

export default function DetailsCard({ item }) {
  const textColor =
    item.role.toUpperCase() === "ADMIN"
      ? "text-Admin3"
      : item.role.toUpperCase() === "SUPERVISOR"
      ? "text-Supervisor3"
      : item.role.toUpperCase() === "HANDLER"
      ? "text-Handler3"
      : null;

  return (
    <View
      style={styles.Pcard}
      className='bg-white flex-row   rounded-2xl mb-5 self-center w-[90vw] h-[12vh] px-[7] items-center justify-between'
    >
      <View
        style={{
          backgroundColor:
            item.role.toUpperCase() === "ADMIN"
              ? "rgba(45, 206, 214, 0.7)"
              : item.role.toUpperCase() === "SUPERVISOR"
              ? "rgba(108, 93, 211, 0.7)"
              : "rgba(242, 153, 74, 0.7)",
        }}
        className={`bg-${textColor} absolute w-[1vw] rounded-full left-[-2px] h-[60%]`}
      ></View>
      <Image source={require("../../assets/images/user_pic.png")} />

      <View className='text-left  w-[60%] pl-3'>
        <Text style={styles.text_md2} className='text-primary'>
          {item.name}
        </Text>
        <Text>{item.dept}</Text>
      </View>
      <View
        style={{
          backgroundColor:
            item.role.toUpperCase() === "ADMIN"
              ? "rgba(45, 206, 214, 0.15)"
              : item.role.toUpperCase() === "SUPERVISOR"
              ? "rgba(108, 93, 211, 0.15)"
              : "rgba(242, 153, 74, 0.15)",
          borderColor:
            item.role.toUpperCase() === "ADMIN"
              ? "rgba(45, 206, 214, .7)"
              : item.role.toUpperCase() === "SUPERVISOR"
              ? "rgba(108, 93, 211, .7)"
              : "rgba(242, 153, 74, .7)",
          borderWidth: 1,
        }}
        className={` rounded-md  py-2 w-[21vw]`}
      >
        <Text
          style={styles.text_md}
          className={`${textColor} text-center text-[10px]`}
        >
          {item.role.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}
