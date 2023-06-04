import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { MaterialIcons } from "@expo/vector-icons";
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

export default function SearchComponent({ filterItems = [] }) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { filter } = useSelector((state) => state.app);

  return (
    <View
      style={{ borderRadius: actuatedNormalize(6) }}
      className={`bg-slate-400 w-[90%] self-center relative h-max py-[1vh] flex flex-row items-center px-[1vw]`}
    >
      <MaterialIcons
        name='search'
        size={actuatedNormalize(20)}
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
            setVisible(!visible);
          }}
          className=''
        >
          <AntDesign
            name='filter'
            size={actuatedNormalize(20)}
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
          className='bg-white px-[5vw] space-y-[12vh] rounded-md'
          // customProp={customValue}
        >
          {/* Use map to generate TouchableOpacity components */}
          {filterItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                dispatch(setFilter(item));
                setVisible(!visible);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </Motion.View>
      )}
    </View>
  );
}
