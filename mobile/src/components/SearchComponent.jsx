import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../styles/stylesheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setVisible,
  setFilter,
} from "../store/slice-reducers/Formslice";
import { AntDesign } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import { accountsFilter } from "../api/Functions";
import { Motion } from "@legendapp/motion";

export default function SearchComponent() {
  const dispatch = useDispatch();
  const { visible, filter } = useSelector((state) => state.app);

  return (
    <View className='bg-slate-400 w-[90%] self-center relative rounded-lg space-x-2 h-max flex flex-row items-center px-2'>
      <MaterialCommunityIcons name='account-search' size={24} color='#004343' />
      <TextInput
        onChangeText={(value) => {
          dispatch(setSearch(value));
        }}
        placeholder={filter || "Name"}
        placeholderTextColor={"#004343"}
        className='w-[80%] h-[5vh] bg-slate-400 rounded-sm self-center'
      />
      <TouchableOpacity
        onPress={() => {
          dispatch(setVisible(!visible));
        }}
        className=''
      >
        <AntDesign name='filter' size={24} color='black' />
      </TouchableOpacity>
      {visible && (
        <Motion.View
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.2 }}
          style={styles.box}
          className='bg-white px-5 rounded-md'
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(setFilter("Name"));
              dispatch(setVisible(!visible));
            }}
          >
            <Text>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(setFilter("Dept"));
              dispatch(setVisible(!visible));
            }}
          >
            <Text>Dept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(setFilter("Role"));
              dispatch(setVisible(!visible));
            }}
          >
            <Text>Role</Text>
          </TouchableOpacity>
        </Motion.View>
      )}
    </View>
  );
}
