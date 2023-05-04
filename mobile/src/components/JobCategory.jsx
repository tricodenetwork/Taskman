import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { category } from "./data";
import { Motion, AnimatePresence } from "@legendapp/motion";
import { FlatList } from "react-native";

export default function JobCategory({ search, onPress, set }) {
  const [bg, setBg] = useState(false);

  const back = () => {
    setBg(true);
  };

  return (
    <Motion.View
      initial={{ x: -500 }}
      animate={{ x: 0 }}
      exit={{ x: 500 }}
      style={styles.shadow}
      className=' scroller absolute top-0 rounded-[25px] border-2 border-slate-300 self-center   bg-white h-[45vh]  w-[80%] p-5 '
    >
      <FlatList
        data={category.filter((item, index) => item.includes(item || search))}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => set(item)}>
              <Motion.Text
                style={{ backgroundColor: "white" }}
                className='my-1 pl-1 border-b-[2px] pb-[2px] border-b-orange-400'
              >
                {item}
              </Motion.Text>
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator
        keyExtractor={(item) => item}
      />
    </Motion.View>
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
