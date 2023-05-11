import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getJobDetails, jobDetails } from "../api/Functions";
import JobCard from "./JobCard";
import { styles } from "../styles/stylesheet";
import { useIsFocused } from "@react-navigation/native";

export default function JobDetails({ onPress, search = "" }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    getJobDetails().then((res) => {
      setData(res);
    });

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
              onPress(
                item._id,
                item.name,
                item.tasks,
                item.duration,
                item.category,
                item.no
              );
            }}
          >
            <JobCard
              id={item._id}
              name={item.name}
              tasks={item.tasks.length}
              duration={item.duration}
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
