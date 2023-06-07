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

export default function DetailsCard({ item, id, index }) {
  const [time, setTime] = useState("");
  const route = useRoute();
  const realm = useRealm();
  const job = useObject(activejob, Realm.BSON.ObjectId(route.params.id));
  const task = job.job.tasks.filter((obj) => obj.name === item.name)[0];
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state);

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

  const { days, hours, minutes } = item.duration;
  const milliseconds =
    days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

  useEffect(() => {
    let interval = null;
    // let newTargetTime = Date.now(); // Initialize newTargetTime outside the interval

    function calculateRemainingTime(targetTime) {
      // Check if the task is completed
      if (item.status == "Completed") {
        clearInterval(interval);
        return;
      }
      let countDownTimer;
      // Calculate the remaining time in milliseconds
      countDownTimer = targetTime - millisecondSinceStartDate(item.inProgress);

      // Calculate the remaining days, hours, minutes, and seconds

      const remainingDays = Math.floor(
        Math.abs(countDownTimer) / (24 * 60 * 60 * 1000)
      );
      const remainingHours = Math.floor(
        (Math.abs(countDownTimer) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const remainingMinutes = Math.floor(
        (Math.abs(countDownTimer) % (60 * 60 * 1000)) / (60 * 1000)
      );
      const remainingSeconds = Math.floor(
        (Math.abs(countDownTimer) % (60 * 1000)) / 1000
      );

      // Add negative sign if time is elapsed

      const isElapsed = countDownTimer <= 0;
      const sign = isElapsed ? "-" : "";

      // set the time variable to display on the UI
      const Timer = `${sign}${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
      setTime(Timer);
    }

    function calculateInterval() {
      if (!item.inProgress) {
        return;
      }

      const targetTime = milliseconds;

      // Set up the interval to update the remaining time every second
      interval = setInterval(calculateRemainingTime(targetTime), 1000);
    }

    // Call calculateInterval when the component mounts during working hours
    !isWeekend & isAllowedTime &&
      calculateInterval(item.duration, item.inProgress, item.completedIn);

    calculateRemainingTime(milliseconds);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, []);

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
        {route.name !== "accounts" && (
          <View
            id='TIMER'
            className='absolute items-center space-x-[3vw] flex flex-row top-[5%] left-[22%]'
          >
            <MaterialIcons
              name='timer'
              size={actuatedNormalize(12)}
              color={time.includes("-") & item.inProgress ? "red" : "#004343"}
            />
            {!item.inProgress ? (
              <Text
                id='TIMER'
                className=' text-primary'
                style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}
              >
                {`${item.duration.days == null ? 0 : item.duration.days}d ${
                  item.duration.hours == null ? 0 : item.duration.hours
                }h ${
                  item.duration.minutes == null ? 0 : item.duration.minutes
                }m`}
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
        )}
        <Text
          style={[styles.text_md2, { fontSize: actuatedNormalize(14) }]}
          className='text-primary'
        >
          {user.role !== "Client" ? item.name : `Task:${index + 1}`}
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
