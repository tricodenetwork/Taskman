import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { getJobDetails, jobDetails } from "../api/Functions";
import JobCard from "./JobCard";
import { styles } from "../styles/stylesheet";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { replaceTask } from "../store/slice-reducers/JobSlice";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { RefreshControl } from "react-native-gesture-handler";
import DetailsCard from "./DetailsCard";
import { AccountRealmContext } from "../models";
import { log } from "react-native-reanimated";

const { useRealm, useQuery } = AccountRealmContext;

export default function TaskDetails({ jobId, reArrange, taskdata }) {
  // const taskdata = realm.objectForPrimaryKey("job", jobId);
  // console.log(taskdata);
  console.log(taskdata);
  const [data, setData] = useState(taskdata);
  const [refreshing, setRefreshing] = useState(false);
  const realm = useRealm();
  const dispatch = useDispatch();
  const route = useRoute();

  const isFocused = useIsFocused();

  // const { tasks } = useSelector((state) => state.Job);

  // const reArrange = useCallback((array) => {
  //   const taskArray = realm.objectForPrimaryKey("job");

  //   realm.write(() => {});
  // });

  useEffect(() => {
    // getJobDetails(jobId).then((res) => {
    setData(taskdata);
    //   dispatch(replaceTask(res.tasks));
    // });

    return () => {
      setRefreshing(false);
    };
  }, [isFocused, refreshing, taskdata]);

  // useEffect(() => {
  //   setData(data);
  //   dispatch(replaceTask(data));
  // }, [data]);
  return (
    <DraggableFlatList
      containerStyle={{ height: "91%" }}
      onDragEnd={({ data }) => {
        reArrange(data);
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
          }}
        />
      }
      data={taskdata}
      renderItem={({ item, drag, isActive }) => {
        return (
          <ScaleDecorator>
            <TouchableOpacity
              onLongPress={drag}
              activeOpacity={0.9}
              // onPress={}
            >
              <View>
                {route.name == "activetasks" ? (
                  <DetailsCard
                    isActive={isActive}
                    // id={jobId}
                    // name={item.name}
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
