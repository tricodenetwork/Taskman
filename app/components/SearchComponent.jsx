import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
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
    <View
      style={{ borderRadius: actuatedNormalize(6) }}
      className={`bg-slate-400 w-[90%] self-center relative h-max py-[1vh] flex flex-row items-center px-[1vw]`}
    >
      <MaterialCommunityIcons
        name='account-search'
        size={actuatedNormalize(23)}
        color='#004343'
      />
      <TextInput
        onChangeText={(value) => {
          dispatch(setSearch(value));
        }}
        style={[styles.averageText, { color: "#004343" }]}
        placeholder={filter || "Name"}
        placeholderTextColor={"rgba(0, 67,67,0.6)"}
        className='w-[80%] h-[5vh] bg-slate-400 rounded-sm self-center'
      />
      <View className='absolute right-[1vw]'>
        <TouchableOpacity
          onPress={() => {
            dispatch(setVisible(!visible));
          }}
          className=''
        >
          <AntDesign
            name='filter'
            size={actuatedNormalize(23)}
            color='#004343'
          />
        </TouchableOpacity>
      </View>
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
