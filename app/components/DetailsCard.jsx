import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";
import { useIsFocused, useRoute } from "@react-navigation/native";

export default function DetailsCard({ item }) {
  const status =
    item.status === "Pending"
      ? "gray"
      : item.status === "In-Progress"
      ? "blue"
      : item.status === "Completed"
      ? "green"
      : null;
  const dynamicColor = () => {
    const textColor =
      item.role.toUpperCase() === "ADMIN"
        ? "text-Admin3"
        : item.role.toUpperCase() === "SUPERVISOR"
        ? "text-Supervisor3"
        : item.role.toUpperCase() === "HANDLER"
        ? "text-Handler3"
        : null;

    const statusColor =
      item.role.toUpperCase() === "ADMIN"
        ? "rgba(45, 206, 214, 0.7)"
        : item.role.toUpperCase() === "SUPERVISOR"
        ? "rgba(108, 93, 211, 0.7)"
        : "rgba(242, 153, 74, 0.7)";

    const backgroundColor =
      item.role.toUpperCase() === "ADMIN"
        ? "rgba(45, 206, 214, 0.15)"
        : item.role.toUpperCase() === "SUPERVISOR"
        ? "rgba(108, 93, 211, 0.15)"
        : "rgba(242, 153, 74, 0.15)";

    return { textColor, statusColor, backgroundColor, status };
  };
  const route = useRoute();
  console.log(item.status);

  return (
    <View
      style={styles.Pcard}
      className='bg-white flex-row   rounded-2xl mb-5 self-center w-[90vw] h-[12vh] px-[7] items-center justify-between'
    >
      <View
        style={{
          backgroundColor: item.role ? dynamicColor().statusColor : status,
        }}
        className={`bg-${
          item.role ? dynamicColor().textColor : null
        } absolute w-[1vw] rounded-full left-[-2px] h-[60%]`}
      ></View>
      {!item.status && (
        <Image source={require("../../assets/images/user_pic.png")} />
      )}

      <View className='text-left  w-[60%] pl-3'>
        <Text style={styles.text_md2} className='text-primary'>
          {item.name}
        </Text>
        <Text>{item.duration}</Text>
      </View>
      <View
        style={{
          backgroundColor: item.role ? dynamicColor().backgroundColor : status,
          borderColor: item.role ? dynamicColor().statusColor : status,
          borderWidth: 1,
        }}
        className={` rounded-md  py-2 w-[21vw]`}
      >
        <Text
          style={styles.text_md}
          className={`${
            item.role ? dynamicColor().textColor : status
          } text-center text-[10px]`}
        >
          {(route.name = "accounts" ? item.role.toUpperCase() : item.status)}

          {item.status && item.status.toUpperCase()}
        </Text>
      </View>
      <Text className='text-[12px] absolute text-Handler3 bottom-1 left-[25%]'>
        Handler:{item.handler || "Not Assigned"}
      </Text>
    </View>
  );
}
