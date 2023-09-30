import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Motion } from "@legendapp/motion";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { useSelector } from "react-redux";

export default function SelectComponent({
  value,
  data,
  setData,
  title,
  placeholder,
  inputStyles = "w-[60vw]",
  visibleStyles = "w-[60vw]",
}) {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState("");

  const { currenttask, handler } = useSelector((state) => state.ActiveJob);

  useEffect(() => {
    if (handler == "" && currenttask == "") {
      setFilter("");
    }
  }, [handler, currenttask]);

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
              style={{ height: actuatedNormalize(150), marginBottom: 10 }}
              data={typeof data[0]?.name === "string" ?data.filter((params) =>
                params?.name?.toLowerCase()?.includes(filter.toLowerCase())
              ):data}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    // dispatch(setData(item.name));
                    setFilter(item.name);
                    // setPlacehold(item.name.toString());
                    setData(item.name);
                    setVisible(!visible);
                  }}
                >
                  <Text
                    style={styles.averageText}
                    className='border-b-[1px] border-b-slate-700'
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Motion.View>
        )}
        <TextInput
          keyboardType='default'
          defaultValue={placeholder}
          editable={value ? false : true}
          value={value ? value : filter}
          onChangeText={setFilter}
          placeholder={placeholder}
          style={[styles.averageText, { color: "black" }]}
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
