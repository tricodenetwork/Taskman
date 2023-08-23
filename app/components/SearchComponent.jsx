import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setSearch, setFilter } from "../store/slice-reducers/Formslice";
import { AntDesign } from "@expo/vector-icons";
import { Motion } from "@legendapp/motion";
import { useIsFocused } from "@react-navigation/native";

function SearchComponent({ filterItems = [], initialFilter }) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [localfilter, setLocalFilter] = useState(initialFilter);

  const focus = useIsFocused();

  useEffect(() => {
    dispatch(setFilter(initialFilter));
  }, [focus]);
  useEffect(() => {
    setTimeout(() => {
      dispatch(setFilter(localfilter));
    }, 0);
  }, [localfilter]);

  return (
    <View
      style={{ borderRadius: actuatedNormalize(6) }}
      className={`bg-[#A6C9C9] w-[90vw] self-center relative h-max py-[1vh] flex flex-row items-center px-[1vw]`}
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
        placeholder={
          localfilter === "MatNo" ? "Client ID" : localfilter || "Name"
        }
        placeholderTextColor={"rgba(0, 67,67,0.6)"}
        className='w-[80%] h-[4vh] bg-[#A6C9C9] rounded-sm self-center'
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
                setLocalFilter(item);
                setVisible(!visible);
                // dispatch(setFilter(item));
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

export default memo(SearchComponent);
