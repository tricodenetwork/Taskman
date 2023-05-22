import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { Fragment as MainBox } from "react";

export default function DetailsCard({ item }) {
  // console.log(item);
  const route = useRoute();
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
  // console.log(item);

  return (
    <View
      style={styles.Pcard}
      className='bg-white flex-row   rounded-2xl mb-4 self-center w-[90vw] h-[14vh] px-[7] items-center justify-between'
    >
      <View
        style={{
          backgroundColor: item.role ? dynamicColor().statusColor : status,
        }}
        className={`bg-${
          item.role ? dynamicColor().textColor : null
        } absolute w-[1vw] rounded-full left-[-2px] h-[60%]`}
      ></View>
      <View
        id='LEFT_SECTION'
        className='text-left w-[70%] space-y-[1vh] relative border- h-full justify-center pl-[2vw]'
      >
        <Text
          style={[styles.text_md2, { fontSize: actuatedNormalize(14) }]}
          className='text-primary'
        >
          {item.name}
        </Text>
        <Text
          style={[styles.text_sm, { fontSize: actuatedNormalize(14) }]}
          className='text-primary'
        >
          {item.dept ? item.dept : item.handler || "Not assigned"}
        </Text>
        {item.duration && (
          <Text
            id='TIMER'
            className='absolute top-[1vh] left-[30%]'
            style={[styles.text_sm, { fontSize: actuatedNormalize(12) }]}
          >
            {item.duration.length === 1
              ? `0${item.duration}:00`
              : `${item.duration}:00`}
          </Text>
        )}
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
          style={[styles.text_md, { fontSize: actuatedNormalize(10) }]}
          className={`${
            item.role ? dynamicColor().textColor : status
          } text-center`}
        >
          {item.role ? item.role.toUpperCase() : null}

          {item.status && item.status.toUpperCase()}
        </Text>
      </View>
      {/* <Text
        style={[{ fontSize: actuatedNormalize(12) }]}
        className='absolute text-Handler3 bottom-1 left-[25%]'
      >
        Handler:{item.handler || "Not Assigned"}
      </Text> */}
    </View>
  );
}
