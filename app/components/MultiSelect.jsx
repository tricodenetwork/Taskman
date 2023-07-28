import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  FlatList,
  TextInput,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Motion } from "@legendapp/motion";
import {
  setVisible,
  setVisible2,
  setVisible3,
} from "../store/slice-reducers/Formslice";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentTask } from "../store/slice-reducers/ActiveJob";
import { actuatedNormalize, styles } from "../styles/stylesheet";

export default function MultiSelect({
  value,
  data,
  setData,
  title,
  placeholder,
  inputStyles = "w-[60vw]",
  visibleStyles = "w-[60vw]",
}) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [placehold, setPlacehold] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(Array(data.length).fill(false));

  const handlePress = (index) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
  };

  return (
    <View id='TASK' className='flex items-center  justify-between  flex-row'>
      <Text className='mr-[3vw]' style={[styles.Pcard]}>
        {title}
      </Text>
      <View className='relative  items-center flex flex-row  rounded-sm h-[20vh]'>
        {visible && (
          <Motion.View
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.2 }}
            style={styles.box}
            className={`bg-white absolute  bottom-0 right-0  space-y-1  border-[1px] border-black ${visibleStyles}  rounded-md`}
          >
            <FlatList
              initialNumToRender={60}
              maxToRenderPerBatch={120}
              style={{ height: actuatedNormalize(150), paddingBottom: 20 }}
              data={data.filter((item) =>
                item.matno.includes(filter.toUpperCase())
              )}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    // dispatch(setData(item.name));
                    handlePress(index);
                    // setPlacehold(item.matno);
                    setData(item.matno);
                    // setVisible(!visible);
                  }}
                  className={`${
                    selected[index] ? "bg-slate-300" : "bg-transparent"
                  } flex flex-row items-center justify-between border-b-[1px] border-b-slate-700`}
                >
                  <Text style={styles.averageText} className=''>
                    {item.matno}
                  </Text>
                  {selected[index] ? (
                    <MaterialCommunityIcons
                      color={"green"}
                      name='check-bold'
                      size={actuatedNormalize(15)}
                    />
                  ) : null}
                </TouchableOpacity>
              )}
            />
          </Motion.View>
        )}
        <TextInput
          // keyboardType=''
          defaultValue={placehold}
          //   value={value}
          onChangeText={setFilter}
          //   editable={false}
          placeholder={placeholder}
          style={[styles.averageText, { color: "black" }]}
          //   value={ActiveJob.currenttask}
          className={`${inputStyles} bg-slate-300  rounded-sm h-10`}
        />
        <View className='absolute  z-[100] right-[1vw]'>
          {data && (
            <TouchableOpacity
              onPress={() => {
                setVisible(!visible);
              }}
            >
              <AntDesign
                name='caretdown'
                size={actuatedNormalize(20)}
                color='#004343'
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
