import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { Fragment as MainBox } from "react";
import { Completed } from "../api/Functions";
import { MaterialIcons } from "@expo/vector-icons";
import { calculateInterval } from "../api/Realm";

export default function HandlerCard({ item }) {
  //____________________________________________________________________STATE AND VARIABLES____________________________________________________________________//
  const [time, setTime] = useState("0d 0h 0m");
  const route = useRoute();
  const status =
    item.status === "Pending" || item.status === ""
      ? "gray"
      : item.status === "InProgress" && !time.includes("-")
      ? "#FFD700"
      : item.status === "InProgress" && time.includes("-")
      ? "#ff4747"
      : item.status === "Completed"
      ? "#006400"
      : null;

  const Time = Completed(item.completedIn, item.inProgress);

  function calculateInterval(duration, inProgress, completedIn) {
    // Convert days, hours, and minutes to milliseconds
    if (!inProgress) {
      return;
    }
    const { days, hours, minutes } = duration;
    const milliseconds =
      days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

    // Get the Inprogess time
    const startTime = inProgress.getTime();

    // Calculate the target time by adding the milliseconds to the start time
    const targetTime = startTime + milliseconds;

    // Set up the interval to update the remaining time every second
    const interval = setInterval(() => {
      // Get the current time
      const currentTime = Date.now();

      // Calculate the remaining time in milliseconds
      const remainingTime = targetTime - currentTime;

      // Check if the remaining time is less than or equal to zero
      if (item.status == "Completed") {
        clearInterval(interval);
        return;
      }

      // Calculate the remaining days, hours, minutes, and seconds
      const isElapsed = remainingTime <= 0;
      const remainingDays = Math.floor(
        Math.abs(remainingTime) / (24 * 60 * 60 * 1000)
      );
      const remainingHours = Math.floor(
        (Math.abs(remainingTime) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const remainingMinutes = Math.floor(
        (Math.abs(remainingTime) % (60 * 60 * 1000)) / (60 * 1000)
      );
      const remainingSeconds = Math.floor(
        (Math.abs(remainingTime) % (60 * 1000)) / 1000
      );

      const sign = isElapsed ? "-" : ""; // Add negative sign if time is elapsed

      // Display the remaining time
      const Timer = `${sign}${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
      // console.log(Timer);
      setTime(Timer);
    }, 1000);
  }

  useEffect(() => {
    calculateInterval(item.duration, item.inProgress, item.completedIn);
  }, [item.inProgress]);

  return (
    // <ActivityIndicator />
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
            color={time.includes("-") ? "red" : "#004343"}
          />
          {!item.inProgress ? (
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
              className={time.includes("-") ? "text-red-600" : "text-primary"}
              style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}
            >
              {item.status == "Completed" ? Time : time}
            </Text>
          )}
        </View>
        <Text
          style={[styles.text_md2, { fontSize: actuatedNormalize(13) }]}
          className='text-primary'
        >
          {item.name}
        </Text>
        <Text
          style={[styles.text_md, { fontSize: actuatedNormalize(12) }]}
          className='text-primary'
        >
          {item.job.name}
        </Text>
        <Text
          style={[styles.text_sm, { fontSize: actuatedNormalize(12) }]}
          className='text-Handler2 absolute bottom-1 left-[22%]'
        >
          {item.supervisor}
        </Text>
      </View>
      <View
        id='STATUS'
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
          {item.status ? item.status : item.status == "" && "PENDING"}
        </Text>
      </View>
    </View>
  );
}
