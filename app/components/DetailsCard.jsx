import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Svg, { Circle, Rect } from "react-native-svg";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { AccountRealmContext } from "../models";
import { activejob } from "../models/Task";
import { calculateTime, millisecondSinceStartDate } from "../api/test";
import { useSelector } from "react-redux";
import { holiday } from "../models/Account";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function DetailsCard({ item, id, index }) {
  const [time, setTime] = useState("");
  const route = useRoute();
  const realm = useRealm();
  const hols = useQuery(holiday);
  const Focus = useIsFocused();

  const job = useObject(activejob, Realm.BSON.ObjectId(route.params.id));
  const task = job.tasks.filter((obj) => obj.name === item.name)[0];
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state);

  const status =
    item.status === "Pending" || item.status == ""
      ? "gray"
      : item.status === "InProgress" && !time.includes("-")
      ? "#FFD700"
      : item.status === "Overdue" && time.includes("-")
      ? "#ff4747"
      : item.status === "Completed"
      ? "green"
      : item.status === "Awaiting"
      ? "#FF925C"
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
  const Time = item.completedIn
    ? calculateTime(item.completedIn.getTime())
    : null;

  const isTodayHoliday = hols.some((holiday) => {
    const holidayDate = new Date(holiday.day);
    const today = new Date();

    return (
      holidayDate.getFullYear() === today.getFullYear() &&
      holidayDate.getMonth() === today.getMonth() &&
      holidayDate.getDate() === today.getDate()
    );
  });

  const { days, hours, minutes } = item.duration;
  const taskDuration =
    days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;
  const overdue = time.includes("-");

  const setStatusOverdue = () => {
    realm.write(() => {
      // item.name == "Posting" ? (item.handler = null) : null;
      overdue && item.status == "InProgress" ? (item.status = "Overdue") : null;
    }),
      [];
  };

  useEffect(() => {
    let interval = null;
    // let newTargetTime = Date.now(); // Initialize newTargetTime outside the interval
    // setStatusOverdue();
    function calculateRemainingTime(duration) {
      // Check if the task is completed
      if (item.status == "Completed") {
        clearInterval(interval);
        return;
      }
      let countDownTimer;
      let timeSpent = item.error
        ? item.completedIn.getTime() +
          task.error +
          millisecondSinceStartDate(item.inProgress, hols)
        : millisecondSinceStartDate(item.inProgress, hols);

      // Calculate the remaining time in milliseconds
      countDownTimer = duration - timeSpent;

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

      // Set up the interval to update the remaining time every second
      interval = setInterval(() => {
        calculateRemainingTime(taskDuration);
      }, 1000);
    }

    // Call calculateInterval when the component mounts during working hours
    !isWeekend & isAllowedTime & !isTodayHoliday &&
      calculateInterval(item.duration, item.inProgress, item.completedIn);

    calculateRemainingTime(taskDuration);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, [item.inProgress]);

  useEffect(() => {
    setStatusOverdue();
  }, [Focus]);
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
          {item.handler == "" || item.handler == null
            ? "Not Assigned"
            : user.role == "Client"
            ? "Assigned"
            : item.handler}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: item.role ? dynamicColor().backgroundColor : status,
          borderColor: item.role ? dynamicColor().statusColor : status,
          borderWidth: 1,
        }}
        className={` rounded-md relative py-2 w-[21vw]`}
      >
        <Text
          style={[styles.text_md, { fontSize: actuatedNormalize(10) }]}
          className={`${
            item.role ? dynamicColor().textColor : status
          } text-center`}
        >
          {item.role ? item.role.toUpperCase() : null}

          {
            // time.includes("-")
            //   ? "OVERDUE"
            //   :
            item.status
            // ? item.status.toUpperCase()
            // : item.status == "" && "PENDING"
          }
        </Text>
        <View
          style={{
            backgroundColor: item.role ? dynamicColor().statusColor : status,
          }}
          className={`bg-${
            item.role ? dynamicColor().textColor : null
          } absolute w-[80%]  rounded-full self-center bottom-[-7px] h-[2.5px]`}
        ></View>
      </View>
    </View>
  );
}
