import { TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { AccountRealmContext } from "../models";
import HandlerCard from "./HandlerCard";
import { RefreshControl } from "react-native-gesture-handler";
import { FlatList } from "react-native";
import { Text } from "react-native";

const { useRealm, useQuery } = AccountRealmContext;

export default function HandlerDetails({ jobId, taskdata, update }) {
  const [data, setData] = useState(taskdata);
  const [refreshing, setRefreshing] = useState(false);
  const { search, filter } = useSelector((state) => state.app);
  const col = filter && filter.toLowerCase();

  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useSelector((state) => state);
  const { handler } = useSelector((state) => state.App);

  const render = ({ item }) => {
    const { name, id, job, matno, supervisor, handler, status } = item;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        className='flex  w-[90vw] self-center bg-primary rounded-2xl mb-5'
        onPress={() => {
          // item contains non_serializable values. id

          navigation.navigate("taskdetailsscreen", {
            name: name,
            matno: matno,
            supervisor: supervisor,
            id: id,
            job: job,
            handler: handler,
            status: status,
            update: update,
          });
        }}
      >
        {/* <Text>Soft</Text> */}
        <HandlerCard item={item} />
      </TouchableOpacity>
    );
  };
  const filteredData = useMemo(() => {
    return Array.from(data).filter((item, index) =>
      item[col]?.name
        ? item[col].name.toLowerCase().includes(search.toLowerCase())
        : (item[col] &&
            item[col].toLowerCase().includes(search.toLowerCase())) ||
          item[col] == ""
    );
  }, [col, search]);

  useEffect(() => {
    setData(taskdata);

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
            update([]);
            setRefreshing(true);
          }}
        />
      }
      containerStyle={{
        height: route.name == "tasks" || user.role == "Client" ? "95%" : "95%",
      }}
      data={filteredData}
      renderItem={render}
      showsVerticalScrollIndicator
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={50}
      maxToRenderPerBatch={100}
      // removeClippedSubviews
      // windowSize={15}
      style={{ height: route.name == "tasks" ? "95%" : "95%" }}
    />
  );
}
