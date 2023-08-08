import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { useIsFocused } from "@react-navigation/native";
import { AccountRealmContext } from "../models";
import { calculateTime, millisecondSinceStartDate } from "../api/test";
import { useSelector } from "react-redux";
import { holiday } from "../models/Account";

const { useRealm, useQuery } = AccountRealmContext;

export default function HandlerCard({ item }) {
  //____________________________________________________________________STATE AND VARIABLES____________________________________________________________________//
  const [time, setTime] = useState("");
  const realm = useRealm();
  const hols = useQuery(holiday);
  const Focus = useIsFocused();
  const Time = item.completedIn
    ? calculateTime(item.completedIn.getTime())
    : null;
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);
  const status =
    item.status === "Pending" || item.status === ""
      ? "gray"
      : item.status === "InProgress" && !time.includes("-")
      ? "#FFD700"
      : item.status === "Overdue"
      ? "#ff4747"
      : item.status === "Completed"
      ? "#006400"
      : item.status === "Awaiting"
      ? "#FF925C"
      : null;
  const { days, hours, minutes } = item.duration;
  const taskDuration =
    days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

  const overdue = time.includes("-");

  const setStatusOverdue = () => {
    realm.write(() => {
      if (overdue && item.status == "InProgress") {
        item.status = "Overdue";
      }
    });
  };

  const isTodayHoliday = hols.some((holiday) => {
    const holidayDate = new Date(holiday.day);
    const today = new Date();

    return (
      holidayDate.getFullYear() === today.getFullYear() &&
      holidayDate.getMonth() === today.getMonth() &&
      holidayDate.getDate() === today.getDate()
    );
  });

  useEffect(() => {
    let interval = null;

    function calculateRemainingTime(duration) {
      // Check if the task is completed
      if (item.status == "Completed") {
        clearInterval(interval);
        return;
      }
      let countDownTimer;
      let timeSpent = item.error
        ? item.completedIn.getTime() +
          item.error +
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
  }, [item.inProgress, overdue, isWeekend, isAllowedTime, isTodayHoliday]);

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
          {item.matno}
        </Text>
        <Text
          style={[styles.text_md, { fontSize: actuatedNormalize(12) }]}
          className='text-primary'
        >
          {item.name}
        </Text>
        <Text
          style={[styles.text_sm, { fontSize: actuatedNormalize(12) }]}
          className='text-Handler2 absolute bottom-1 left-[22%]'
        >
          {item.job}
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
