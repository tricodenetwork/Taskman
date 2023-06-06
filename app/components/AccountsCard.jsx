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

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function AccountsCard({ item, id }) {
  const [time, setTime] = useState("");
  const route = useRoute();
  const realm = useRealm();

  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);

  const status =
    item.status === "Pending" || item.status == ""
      ? "gray"
      : item.status === "InProgress" && !time.includes("-")
      ? "#FFD700"
      : item.status === "InProgress" && time.includes("-")
      ? "#ff4747"
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
  const Time = Completed(item.completedIn, item.inProgress); // Variable to store the remaining time when the interval is paused

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
          style={[styles.text_sm, { fontSize: actuatedNormalize(12) }]}
          className='text-primary'
        >
          {item.dept ? item.dept : item.handler || "Not assigned"}
        </Text>
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

          {item.status
            ? item.status.toUpperCase()
            : item.status == "" && "PENDING"}
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
