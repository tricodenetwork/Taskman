import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Motion } from "@legendapp/motion";
import { styles } from "../styles/stylesheet";
import { setMenu } from "../store/slice-reducers/Formslice";
import { useNavigation } from "@react-navigation/native";

export default function Menu() {
  const { menu } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  if (!menu) {
    return null;
  } else
    return (
      <Motion.View
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className='h-[100vh]  pt-[8vh] absolute top-[-2vh] border-b-2 border-r-2 border-primary bg-white left-0 w-[60vw]'
      >
        <View className='relative w-auto z-50 h-[100%] gap-3 mx-[2vw]'>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("profile");
              dispatch(setMenu());
            }}
          >
            <Text style={styles.text_md2} className='text-xl text-primary'>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("accounts");
              dispatch(setMenu());
            }}
          >
            <Text style={styles.text_md2} className='text-xl text-primary'>
              Accounts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("jobs");
              dispatch(setMenu());
            }}
          >
            <Text style={styles.text_md2} className='text-xl text-primary'>
              Jobs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("actions");
              dispatch(setMenu());
            }}
          >
            <Text style={styles.text_md2} className='text-xl text-primary'>
              Holidays
            </Text>
          </TouchableOpacity>

          <View className='absolute flex flex-row-reverse items-center justify-between w-full border- bottom-[-2%] self-center px-[2vw]'>
            {/* <TouchableOpacity onPress={handleLogout}>
              <Text
                style={styles.text_md2}
                className=' text-primary underline '
              >
                Logout
              </Text>
            </TouchableOpacity> */}

            {/* <Text style={styles.text_md2} className='text-[8px]  text-primary'>
              &copy; 2023
            </Text> */}
          </View>
        </View>
      </Motion.View>
    );
}
