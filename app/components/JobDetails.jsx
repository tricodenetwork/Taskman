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
import { useSelector } from "react-redux";
import { Realm } from "@realm/react";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function JobDetails({ onPress }) {
  const [refreshing, setRefreshing] = useState(false);
  const { search, filter } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state);
  const route = useRoute();
  const realm = useRealm();
  const jobs = useQuery(job);
  const activeJobs = useQuery(activejob);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const col = filter && filter.toLowerCase();
  const isFocused = useIsFocused();
  const client = activeJobs.filtered(`matno ==$0`, user.clientId) ?? [];

  function updateJobStatus(supervisorName) {
    console.log("updating job status");
    realm.write(() => {
      activeJobs.forEach((activejob) => {
        let jobstatus = "Pending";
        // let allTasksCompleted = true;

        for (const task of activejob.tasks) {
          if (task.handler != null && task.status == "Pending") {
            jobstatus = "Awaiting";
            break;
          } else if (
            task.status == "InProgress" ||
            task.status == "Completed"
          ) {
            jobstatus = "InProgress";
            break;
          } else if (
            task.status !== "InProgress" &&
            task.status !== "Pending"
          ) {
            jobstatus = "Completed";
          }
        }

        activejob.status = jobstatus;
      });
    });
  }
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
  }, [refreshing]);
  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            // updateJobStatus();
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
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              const screenName =
                route.name === "jobs" ? "tasks" : "activetasks";
              navigation.navigate(screenName, { id: item._id.toString() });
            }}
          >
            <JobCard
              // name={item.name}
              // tasks={item.tasks.length}
              // duration={item.duration}
              item={item}
            />
          </TouchableOpacity>
        );
      }}
      showsVerticalScrollIndicator
      keyExtractor={(item) => item._id}
      style={{ height: "83%" }}
      initialNumToRender={60}
      maxToRenderPerBatch={120}
    />
  );
}
