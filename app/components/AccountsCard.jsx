import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { Fragment as MainBox } from "react";
import { Completed } from "../api/Functions";
import { MaterialIcons } from "@expo/vector-icons";
import { AccountRealmContext } from "../models";
import { activejob } from "../models/Task";
import { remainingTimetohours } from "../api/Realm";
import { millisecondSinceStartDate, morning } from "../api/test";
import { useSelector } from "react-redux";


export default function AccountsCard({ item, id }) {


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

    return { textColor, statusColor, backgroundColor };
  };

  return (
    <View
      style={styles.Pcard}
      className='bg-white flex-row   rounded-2xl mb-4 self-center w-[90vw] h-[14vh] px-[7] items-center justify-between'
    >
      <View
        style={{
          backgroundColor:dynamicColor().statusColor
        }}
        className={`bg-${
         dynamicColor().textColor
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
          style={[styles.text_sm, { fontSize: actuatedNormalize(12) }]}
          className='text-primary'
        >
          {item.dept}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: dynamicColor().backgroundColor,
          borderColor: dynamicColor().statusColor ,
          borderWidth: 1,
        }}
        className={` rounded-md  py-2 w-[21vw]`}
      >
        <Text
          style={[styles.text_md, { fontSize: actuatedNormalize(10) }]}
          className={`${
             dynamicColor().textColor  
          } text-center`}
        >
          {item.role.toUpperCase()}

        </Text>
      </View>
      <Text
        style={[{ fontSize: actuatedNormalize(12) }]}
        className='absolute text-Handler3 bottom-1 left-[25%]'
      >
        {item.category?.name}
      </Text>
    </View>
  );
}
