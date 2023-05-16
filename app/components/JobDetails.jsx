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
import { useIsFocused, useRoute } from "@react-navigation/native";

export default function JobDetails({ onPress, search = "" }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.name == "activeJobs") {
      getActiveJobs().then((res) => {
        setData(res);
        console.log(res);
      });
    } else {
      getJobDetails().then((res) => {
        setData(res);
      });
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
              onPress(item);
            }}
          >
            <JobCard
              id={item._id}
              name={item.name}
              tasks={item.tasks.length}
              duration={item.duration}
              item={item}
            />
          </TouchableOpacity>
        );
      }}
      showsVerticalScrollIndicator
      keyExtractor={(item) => item._id}
      style={{ height: "85%" }}
    />
  );
}
