import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import SearchComponent from "../components/SearchComponent";
import JobDetails from "../components/JobDetails";
import LowerButton from "../components/LowerButton";
import { setFilter, setSearch } from "../store/slice-reducers/Formslice";
import { useDispatch, useSelector } from "react-redux";
import { holiday } from "../models/Account";
import Realm from "realm";
import { AccountRealmContext } from "../models";
import { useIsFocused } from "@react-navigation/native";
import OdinaryButton from "../components/OdinaryButton";
import { activejob } from "../models/Task";
import { millisecondSinceStartDate } from "../api/test";
import { SCREEN_HEIGHT } from "../styles/stylesheet";

const { useRealm, useQuery } = AccountRealmContext;
export default function ActiveJobs({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const [update, setUpdate] = useState(false);
  const realm = useRealm();
  const Focus = useIsFocused();
  const activeJobs = useQuery(activejob);
  const hols = useQuery(holiday);

  function calculateRemainingTime(duration, item) {
    // Check if the task is completed
    if (item.status == "Completed") {
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
    return Timer;
  }

  function updateJobStatus(supervisorName) {
    realm.write(() => {
      activeJobs.forEach((activejob) => {
        let jobstatus = "Pending";
        // let allTasksCompleted = true;
        // activejob.duration="6d 14h 0m"

        for (const task of activejob.tasks) {
          const { days, hours, minutes } = task.duration;
          const duration =
            days * 24 * 60 * 60 * 1000 +
            hours * 60 * 60 * 1000 +
            minutes * 60 * 1000;
          const currentTime = calculateRemainingTime(duration, task);

          if (currentTime?.includes("-")) {
            task.status = "Overdue";
          }
          if (task.status == "Overdue") {
            jobstatus = "Overdue";
            break;
          } else if (
            task.status == "InProgress" ||
            task.status == "Completed"
          ) {
            jobstatus = "InProgress";
          } else if (
            task.status !== "InProgress" &&
            task.status !== "Pending" &&
            task.status !== "Overdue" &&
            task.status !== "Awaiting" &&
            task.status !== ""
          ) {
            jobstatus = "Completed";
          }
        }
        for (const task of activejob.tasks) {
          if (task.status == "Awaiting") {
            jobstatus = "Awaiting";
            break;
          }
        }

        activejob.status = jobstatus;
      });
    });
    // console.log("updating");
    setUpdate(true);
  }

  useEffect(() => {
    dispatch(setFilter("MatNo"));
    dispatch(setSearch(""));
  }, [Focus]);

  useEffect(() => {
    setTimeout(() => {
      updateJobStatus();
    }, 0);
  }, [Focus]);

  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={!user.clientId ? "ActiveJobs" : "MyJob"}></Topscreen>
      <View
        className='bg-slate-200 h-[85vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        {!user.clientId ? (
          <OdinaryButton
            color={"white"}
            // bg={"#77e6b6"}
            navigate={() => {
              navigation.navigate("it");
            }}
            text='Assign Multiple Tasks'
            style={`absolute ${
              SCREEN_HEIGHT < 500 ? "-top-[6vh]" : "-top-[5vh]"
            } w-[55vw]`}
          />
        ) : null}
        <View className='mb-1'>
          {!user.clientId ? (
            <SearchComponent
              filterItems={["Job Name", "Client ID", "Supervisor", "Status"]}
            />
          ) : null}
        </View>
        <View className=''>
          {!update ? (
            <View className='relative top-[5vh]'>
              <ActivityIndicator size={"large"} color={"rgb(88 28 135)"} />
            </View>
          ) : (
            <JobDetails update={updateJobStatus} />
          )}
        </View>
      </View>
      {user.role !== "Client" && (
        <LowerButton
          style={"w-[90vw]"}
          // disabled={
          //   isWeekend || isTodayHoliday || !isAllowedTime ? true : false
          // }
          navigate={() => {
            navigation.navigate("ActivateJob");
          }}
          text={
            // isTodayHoliday
            //   ? "Public Holiday"
            //   : isWeekend || !isAllowedTime
            //   ? "Outside working hours"
            //   :
            "Activate"
          }
          p
        />
      )}
    </Background>
  );
}
