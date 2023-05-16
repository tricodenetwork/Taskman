import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { getJobDetails, jobDetails } from "../api/Functions";
import JobCard from "./JobCard";
import { styles } from "../styles/stylesheet";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { replaceTask } from "../store/slice-reducers/JobSlice";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { RefreshControl } from "react-native-gesture-handler";
import DetailsCard from "./DetailsCard";

export default function TaskDetails({ jobId, onPress, taskdata }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  const { tasks } = useSelector((state) => state.job);

  useEffect(() => {
    getJobDetails(jobId).then((res) => {
      setData(res.tasks);
      dispatch(replaceTask(res.tasks));
    });

    return () => {
      setRefreshing(false);
    };
  }, [isFocused, refreshing, taskdata]);

  useEffect(() => {
    setData(data);
    dispatch(replaceTask(data));
  }, [data]);
  return (
    <DraggableFlatList
      containerStyle={{ height: "95%" }}
      onDragEnd={({ data }) => {
        setData(data);
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
          }}
        />
      }
      data={data || taskdata}
      renderItem={({ item, drag, isActive }) => {
        return (
          <ScaleDecorator>
            <TouchableOpacity
              onLongPress={drag}
              activeOpacity={0.9}
              onPress={onPress}
            >
              <View>
                {item.status ? (
                  <DetailsCard
                    isActive={isActive}
                    id={jobId}
                    name={item.name}
                    duration={item.duration}
                    item={item}
                  />
                ) : (
                  <JobCard
                    isActive={isActive}
                    id={jobId}
                    name={item.name}
                    duration={item.duration}
                    item={item}
                  />
                )}
              </View>
            </TouchableOpacity>
          </ScaleDecorator>
        );
      }}
      showsVerticalScrollIndicator
      keyExtractor={(item, index) => index}
      style={{ height: "85%" }}
    />
  );
}
