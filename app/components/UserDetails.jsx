import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AccountRealmContext } from "../models";
import { Account } from "../models/Account";
import { useNavigation } from "@react-navigation/native";
import AccountsCard from "./AccountsCard";

const { useRealm, useQuery } = AccountRealmContext;
//-------------------------------------------------------------------------------------------------STATE AND VARIABLES

export default function UserDetails({ onPress, set }) {
  const { search, filter } = useSelector((state) => state.app);
  const [refreshing, setRefreshing] = useState(false);
  const accounts = useQuery(Account);
  const navigation = useNavigation();

  const col = filter && filter.toLowerCase();
  // console.log(col, accounts);

  //__________________________________________________________________________________________________USE EFFECTS AND FUNCTIONS
  useEffect(() => {
    return () => {
      setRefreshing(false);
    };
  }, [refreshing]);

  //_____________________________________________________________________________________________________RENDERED COMPONENT

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
      data={accounts.filter(
        (item, index) =>
          item[col] && item[col].toLowerCase().includes(search.toLowerCase())
      )}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate("CreateAccount", {
                id: item._id.toString(),
              });
            }}
          >
            <AccountsCard item={item} />
          </TouchableOpacity>
        );
      }}
      showsVerticalScrollIndicator
      keyExtractor={(item) => item._id}
      style={{ height: "80%" }}
    />
  );
}
