import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import JobCard from "./JobCard";
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

export default function JobDetails({ update }) {
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
  }, []);

  useEffect(() => {
    if (route.name !== "jobs") {
      update();
    }
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
      initialNumToRender={50}
      removeClippedSubviews={true}
      maxToRenderPerBatch={150}
    />
  );
}
