import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 20 }}
        className='h-[80vh]  pt-[7vh] absolute   top-0 border-b-2 border-r-2 border-primary bg-white left-0 w-[60vw]'
      >
        <View className='relative w-auto z-50 h-[100%] gap-3 mx-[2vw]'>
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
              navigation("handler");
            }}
          >
            <Text style={styles.text_md2} className='text-xl text-primary'>
              Chats
            </Text>
          </TouchableOpacity>
          <View className='absolute flex flex-row-reverse items-center justify-between w-full border- bottom-[0%] self-center px-[2vw]'>
            <TouchableOpacity>
              <Text
                style={styles.text_md2}
                className=' text-primary underline '
              >
                Logout
              </Text>
            </TouchableOpacity>

            <Text style={styles.text_md2} className='text-[8px]  text-primary'>
              &copy; 2023
            </Text>
          </View>
        </View>
      </Motion.View>
    );
}
