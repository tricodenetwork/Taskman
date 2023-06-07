import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import JobCard from "./JobCard";
import { styles } from "../styles/stylesheet";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { RefreshControl } from "react-native-gesture-handler";
import DetailsCard from "./DetailsCard";
import { AccountRealmContext } from "../models";
import HandlerCard from "./HandlerCard";

const { useRealm, useQuery } = AccountRealmContext;

export default function TaskDetails({ jobId, reArrange, taskdata }) {
  // const taskdata = realm.objectForPrimaryKey("job", jobId);
  // console.log(taskdata);
  const [data, setData] = useState(taskdata);
  const [refreshing, setRefreshing] = useState(false);
  const realm = useRealm();
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useSelector((state) => state);
  console.log(user.role);

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
      containerStyle={{
        height: route.name == "tasks" || user.role == "Client" ? "96%" : "91%",
      }}
      onDragEnd={({ data }) => {
        route.name !== "mytasks" && reArrange(data);
      }}
      refreshControl={
        <RefreshControl
          // refreshing={refreshing}
          onRefresh={() => {
            // setRefreshing(true);
          }}
        />
      }
      data={taskdata}
      renderItem={({ item, drag, isActive, getIndex }) => {
        // console.log(getIndex());
        const { name, id, job, matNo, supervisor, handler, status } = item;
        return (
          <ScaleDecorator>
            <TouchableOpacity
              onLongPress={() => {
                route.name !== "mytasks" ? drag() : null;
                isActive && setRefreshing(false);
              }}
              activeOpacity={0.8}
              onPress={() => {
                // item contains non_serializable values. id
                route.name == "mytasks" &&
                  navigation.navigate("taskdetailsscreen", {
                    name: name,
                    matNo: matNo,
                    supervisor: supervisor,
                    id: id,
                    job: job.name,
                    handler: handler,
                    status: status,
                  });
              }}
            >
              {!item.name ? (
                <Text
                  style={[styles.text_sm2]}
                  className='self-center mb-[1vh]'
                >
                  {item.toString()}
                </Text>
              ) : (
                <View>
                  {route.name == "activetasks" ? (
                    <DetailsCard
                      isActive={isActive}
                      id={jobId}
                      index={getIndex()}
                      // name={item.name}
                      // duration={item.duration}
                      item={item}
                    />
                  ) : route.name == "mytasks" ? (
                    <HandlerCard
                      isActive={isActive}
                      // id={jobId}
                      // name={item.name}
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
              )}
            </TouchableOpacity>
          </ScaleDecorator>
        );
      }}
      showsVerticalScrollIndicator
      keyExtractor={(item, index) => index}
      // style={{ height: route.name == "tasks" ? "95%" : "95%" }}
    />
  );
}
