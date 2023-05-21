import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getActiveJobs, getJobDetails, jobDetails } from "../api/Functions";
import JobCard from "./JobCard";
import { styles } from "../styles/stylesheet";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { AccountRealmContext } from "../models";
import { activejob, job } from "../models/Task";

const { useRealm, useQuery } = AccountRealmContext;
export default function JobDetails({ onPress, search = "" }) {
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  const jobs = useQuery(job);
  const activeJobs = useQuery(activejob);
  const [data, setData] = useState(
    route.name == "activeJobs" ? activeJobs : jobs
  );
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.name == "activeJobs") {
      setData(activeJobs);
    } else {
      setData(jobs);
    }

    return () => {
      setRefreshing(false);
    };
  }, [isFocused, refreshing]);
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
      data={data}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              route.name == "jobs"
                ? navigation.navigate("tasks", { id: item._id })
                : navigation.navigate("activetasks", { id: item._id });
            }}
          >
            <JobCard
              id={item._id}
              // name={item.name}
              tasks={item.tasks.length}
              // duration={item.duration}
              item={item}
            />
          </TouchableOpacity>
        );
      }}
      showsVerticalScrollIndicator
      keyExtractor={(item) => item._id}
      style={{ height: "83%" }}
    />
  );
}
