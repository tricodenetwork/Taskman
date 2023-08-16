import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { SCREEN_HEIGHT } from "../styles/stylesheet";
import ActiveJobCard from "./ActiveJobCard";

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

  // Move the renderItem function outside of the component
  // or wrap it in a useCallback hook to avoid unnecessary re-renders
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <View>
          <TouchableOpacity
            activeOpacity={0.9}
            className='flex max-w-max w-[90vw] self-center bg-primary rounded-2xl mb-5'
            onPress={() => {
              const screenName =
                route.name === "jobs" ? "tasks" : "activetasks";
              navigation.navigate(screenName, {
                id: item._id.toString(),
              });
            }}
          >
            <ActiveJobCard id={item._id.toString()} />
          </TouchableOpacity>
        </View>
      );
    },
    [route.name]
  );

  // Use a memoized value for the filteredData variable to avoid unnecessary recalculations
  const filteredData = useMemo(
    () =>
      data
        .filter((item, index) =>
          item[col]?.name
            ? item[col].name.toLowerCase().includes(search.toLowerCase())
            : item[col] &&
              item[col].toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp()),
    [col, data, search]
  );
  const ITEM_HEIGHT = 0.14 * SCREEN_HEIGHT;
  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });
  const keyExtractor = (item) => item._id;

  // Add activeJobs, jobs and client as dependencies to the useEffect hook so that it runs whenever their values change
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
      data={filteredData}
      renderItem={renderItem}
      showsVerticalScrollIndicator
      keyExtractor={keyExtractor}
      style={{ height: "83%" }}
      initialNumToRender={50}
      maxToRenderPerBatch={100}
      getItemLayout={getItemLayout}
    />
  );
}
