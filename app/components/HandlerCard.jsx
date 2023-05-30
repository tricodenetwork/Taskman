import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { Fragment as MainBox } from "react";
import { Completed } from "../api/Functions";
import { MaterialIcons } from "@expo/vector-icons";

export default function HandlerCard({ item }) {
  //____________________________________________________________________STATE AND VARIABLES____________________________________________________________________//
  const route = useRoute();
  const status =
    item.status === "Pending"
      ? "gray"
      : item.status === "InProgress"
      ? "#FFD700"
      : item.status === "Completed"
      ? "#006400"
      : null;

  const Time = Completed(item.completedIn, item.inProgress);
  return (
    <View
      style={styles.Pcard}
      className='bg-white flex-row   rounded-2xl mb-4 self-center w-[90vw] h-[14vh] px-[7] items-center justify-between'
    >
      <View
        style={{
          backgroundColor: status,
        }}
        className={`absolute w-[1vw] rounded-full left-[-2px] h-[60%]`}
      ></View>
      <View
        id='LEFT_SECTION'
        className='text-left w-[70%] space-y-[1vh] relative border- h-full justify-center pl-[2vw]'
      >
        <View
          id='TIMER'
          className='absolute items-center space-x-[3vw] flex flex-row top-[5%] left-[22%]'
        >
          <MaterialIcons
            name='timer'
            size={actuatedNormalize(12)}
            color='#004343'
          />
          {item.timer == "00:00" ? (
            <Text
              id='TIMER'
              className=' text-primary'
              style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}
            >
              {`${item.duration.days == null ? 0 : item.duration.days}d ${
                item.duration.hours == null ? 0 : item.duration.hours
              }h ${item.duration.minutes == null ? 0 : item.duration.minutes}m`}
            </Text>
          ) : (
            <Text
              id='TIMER'
              className='text-primary'
              style={[styles.text_sm, { fontSize: actuatedNormalize(14) }]}
            >
              {item.status == "Completed"
                ? `${Time.hours}:${Time.minutes}`
                : item.timer}
            </Text>
          )}
        </View>
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
          {item.supervisor}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: status,
          borderColor: status,
          borderWidth: 1,
        }}
        className={`rounded-md  py-2 w-[21vw]`}
      >
        <Text
          style={[styles.text_md, { fontSize: actuatedNormalize(11) }]}
          className={`${
            item.role ? dynamicColor().textColor : status
          } text-center`}
        >
          {item.status && item.status}
        </Text>
      </View>
    </View>
  );
}
