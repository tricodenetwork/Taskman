import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import JobCard from "./JobCard";
import { styles } from "../styles/stylesheet";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { AccountRealmContext } from "../models";
import { activejob, job } from "../models/Task";
import { useSelector, useDispatch } from "react-redux";
import { Realm } from "@realm/react";
import { setRefresh } from "../store/slice-reducers/App";
import { millisecondSinceStartDate } from "../api/test";
import { holiday } from "../models/Account";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function JobDetails({ onPress }) {
  const [refreshing, setRefreshing] = useState(false);
  const { search, filter } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state);
  const route = useRoute();
  const realm = useRealm();
  const jobs = useQuery(job);
  const dispatch = useDispatch();
  const activeJobs = useQuery(activejob);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const col = filter && filter.toLowerCase();
  const isFocused = useIsFocused();
  const client = activeJobs.filtered(`matno ==$0`, user.clientId) ?? [];
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
        for (const task of activejob.tasks) {
          const { days, hours, minutes } = task.duration;
          const duration =
            days * 24 * 60 * 60 * 1000 +
            hours * 60 * 60 * 1000 +
            minutes * 60 * 1000;
          const currentTime = calculateRemainingTime(duration, task);

          if (currentTime?.includes("-")) {
            task.status = "Overdue";
            break;
          }
        }
      });
    });
    realm.write(() => {
      activeJobs.forEach((activejob) => {
        let jobstatus = "Pending";
        // let allTasksCompleted = true;
        // activejob.duration="6d 14h 0m"

        for (const task of activejob.tasks) {
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
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          const screenName = route.name === "jobs" ? "tasks" : "activetasks";
          navigation.navigate(screenName, { id: item._id.toString() });
        }}
      >
        <JobCard id={item._id.toString()} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (!user.clientId) {
      if (route.name == "activeJobs") {
        setData(activeJobs);
      } else {
        setData(jobs);
      }
    } else {
      setData(client);
    }
    return () => {
      setRefreshing(false);
    };
  }, [isFocused, refreshing]);

  useEffect(() => {
    updateJobStatus();
    return () => {
      setRefreshing(false);
    };
  }, [refreshing, isFocused]);
  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
          }}
        />
      }
      data={data
        .filter((item, index) =>
          item[col]?.name
            ? item[col].name.toLowerCase().includes(search.toLowerCase())
            : item[col] &&
              item[col].toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp())}
      renderItem={renderItem}
      showsVerticalScrollIndicator
      keyExtractor={(item) => item._id}
      style={{ height: "83%" }}
      initialNumToRender={20}
      maxToRenderPerBatch={50}
    />
  );
}
