import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { Motion } from "@legendapp/motion";
import { styles } from "../styles/stylesheet";

export default function Menu({ navigation }) {
  const { menu } = useSelector((state) => state.app);

  if (!menu) {
    return null;
  } else
    return (
      <Motion.View
        initial={{ y: -1000 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.6 }}
        className='h-[80vh] space-y-5 px-[10%] py-[20%] absolute e z-50 top-[1vh] border-b-2 border-r-2 border-primary bg-white left-0 w-[60vw]'
      >
        <TouchableOpacity
          onPress={() => {
            navigation("profile");
          }}
        >
          <Text style={styles.text_md2} className='text-xl text-primary'>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation("accounts");
          }}
        >
          <Text style={styles.text_md2} className='text-xl text-primary'>
            Accounts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation("activeJobs");
          }}
        >
          <Text style={styles.text_md2} className='text-xl text-primary'>
            Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation("jobs");
          }}
        >
          <Text style={styles.text_md2} className='text-xl text-primary'>
            Chats
          </Text>
        </TouchableOpacity>
        <Text
          style={styles.text_md2}
          className=' text-primary_lights underline absolute bottom-[2%] right-[10%]'
        >
          Logout
        </Text>
        {/* <Text
          style={styles.text_md2}
          className='text-sm relative top-[67%] text-primary'
        >
          &copy; 2023
        </Text> */}
      </Motion.View>
    );
}
