import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import DetailsCard from "./DetailsCard";
import { AccountRealmContext } from "../models";
import { RefreshControl } from "react-native-gesture-handler";

const { useRealm, useQuery } = AccountRealmContext;

export default function TaskDetails({
  jobId,
  reArrange,
  taskdata,
  foreignSupervisor,
  clientId,
}) {
  const [data, setData] = useState(taskdata);
  const [refreshing, setRefreshing] = useState(false);
  const { search, filter } = useSelector((state) => state.app);
  const col = filter && filter.toLowerCase();

  const realm = useRealm();
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useSelector((state) => state);

  const renderItem = useCallback(
    ({ item, drag, isActive, getIndex }) => {
      const { name, id, job, matno, supervisor, handler, status } = item;
      return (
        <ScaleDecorator>
          <TouchableOpacity
            onLongPress={() => {
              route.name == "tasks" ? drag() : null;
              isActive && setRefreshing(false);
            }}
            activeOpacity={0.9}
            className='flex  w-[90vw] self-center bg-primary rounded-2xl mb-5'
            onPress={() => {
              // item contains non_serializable values. id
              route.name == "mytasks" &&
                navigation.navigate("taskdetailsscreen", {
                  name: name,
                  matno: matno,
                  supervisor: supervisor,
                  id: id,
                  job: job,
                  handler: handler,
                  status: status,
                });

              (route.name == "activetasks") & !foreignSupervisor &&
                navigation.navigate("it", {
                  taskName: name,
                  id: route.params.id,
                  clientId: clientId,
                  taskHandler: handler,
                });
            }}
          >
            {!item.name ? (
              <Text style={[styles.text_sm2]} className='self-center mb-[1vh]'>
                {item.toString()}
              </Text>
            ) : (
              <View>
                {route.name == "activetasks" ? (
                  <DetailsCard
                    isActive={isActive}
                    id={jobId}
                    index={getIndex()}
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
    },
    [route.name]
  );

  const filteredData = useMemo(
    () =>
      Array.from(data).filter((item, index) =>
        item[col]?.name
          ? item[col].name.toLowerCase().includes(search.toLowerCase())
          : (item[col] &&
              item[col].toLowerCase().includes(search.toLowerCase())) ||
            item[col] == ""
      ),
    [col, search, data]
  );

  useEffect(() => {
    setData(taskdata);

    return () => {
      setRefreshing(false);
    };
  }, [isFocused, refreshing]);

  return (
    <DraggableFlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
          }}
        />
      }
      containerStyle={{
        height: route.name == "tasks" || user.role == "Client" ? "95%" : "95%",
      }}
      onDragEnd={({ data }) => {
        route.name == "tasks" && reArrange(data);
      }}
      data={filteredData}
      renderItem={renderItem}
      showsVerticalScrollIndicator
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={20}
      maxToRenderPerBatch={30}
    />
  );
}
