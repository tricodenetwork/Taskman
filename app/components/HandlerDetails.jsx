import { TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import HandlerCard from "./HandlerCard";
import { RefreshControl } from "react-native-gesture-handler";
import { FlatList } from "react-native";

export default function HandlerDetails({ taskdata, update }) {
  const [data, setData] = useState(taskdata);
  const [refreshing, setRefreshing] = useState(false);
  const { search, filter } = useSelector((state) => state.app);
  const col = filter && filter.toLowerCase();

  const navigation = useNavigation();
  const isFocused = useIsFocused();

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
        height: "95%",
      }}
      data={filteredData}
      renderItem={render}
      showsVerticalScrollIndicator
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={50}
      maxToRenderPerBatch={100}
      // removeClippedSubviews
      // windowSize={15}
      style={{ height: "95%" }}
    />
  );
}
