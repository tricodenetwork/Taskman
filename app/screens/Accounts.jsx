import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import LowerButton from "../components/LowerButton";
import SearchComponent from "../components/SearchComponent";
import UserDetails from "../components/UserDetails";
import { useDispatch } from "react-redux";
import { setFilter } from "../store/slice-reducers/Formslice";
// import { accounts } from "../api/Functions";

export default function Accounts({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilter("Name"));
  }, []);
  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={"Accounts"} />
      <View
        className='bg-slate-200 h-[85vh] rounded-t-3xl  pt-[3vh] w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent filterItems={["Name", "Dept", "Role"]} />
        </View>
        <View>
          <UserDetails />
        </View>
      </View>
      <LowerButton
        style={"w-[90vw]"}
        navigate={() => {
          navigation.navigate("CreateAccount");
        }}
        text={"Add"}
      />
    </Background>
  );
}
