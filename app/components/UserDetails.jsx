import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { category } from "./data";
import { Motion, AnimatePresence } from "@legendapp/motion";
import { FlatList } from "react-native";
import DetailsCard from "./DetailsCard";
import { useDispatch, useSelector } from "react-redux";
import { accounts, getUserDetails } from "../api/Functions";
import { setUsers } from "../store/slice-reducers/Database";

export default function UserDetails({ onPress, set }) {
  const { search, filter } = useSelector((state) => state.app);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const col = filter.toLowerCase();
  // console.log(col);

  useEffect(() => {
    getUserDetails().then((res) => {
      setData(res);
      dispatch(setUsers(res));
    });
    return () => {
      setRefreshing(false);
    };
  }, [refreshing]);

  return (
    data !== [] && (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
            }}
          />
        }
        data={data.filter(
          (item, index) =>
            item[col] && item[col].toLowerCase().includes(search.toLowerCase())
        )}
        // data={data}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onPress(item);
              }}
            >
              <DetailsCard item={item} />
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator
        keyExtractor={(item) => item._id}
        style={{ height: "85%" }}
      />
    )
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "blue",
    shadowOffset: { width: 0, height: 50 },
    elevation: 5,
    // shadowOpacity: 1,
    shadowRadius: 50,
  },
});
