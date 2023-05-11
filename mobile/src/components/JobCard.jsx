import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "../styles/stylesheet";
import { AntDesign } from "@expo/vector-icons";
import { deleteJob, deleteTasks } from "../api/Functions";
import { setVisible } from "../store/slice-reducers/Formslice";
import { useSelector, useDispatch } from "react-redux";
import OdinaryButton from "./OdinaryButton";
import { Motion } from "@legendapp/motion";
import { useRoute } from "@react-navigation/native";

export default function JobCard({ isActive, id, name, tasks, duration }) {
  const [visible, setVisible] = useState(false);
  const route = useRoute();
  //   console.log(route.name);

  return (
    <View
      style={[styles.Pcard, { backgroundColor: isActive ? "pink" : "white" }]}
      className='bg-white flex-row   rounded-2xl mb-5 self-center w-[90vw] h-[12vh] px-[7] items-center justify-between'
    >
      <View
        style={{
          backgroundColor: "rgba(45, 206, 214, 0.7)",
        }}
        className={`bg-blue-500 absolute w-[1vw] rounded-full left-[-2px] h-[60%]`}
      ></View>
      {/* <Image source={require("../../assets/images/user_pic.png")} /> */}

      <View className='text-left  w-[60%] pl-3'>
        <Text style={styles.text_md2} className='text-primary'>
          {name}
        </Text>
        {tasks ? <Text>Tasks:{tasks}</Text> : null}
        <Text>{duration}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setVisible(!visible);
        }}
      >
        <AntDesign name='delete' size={24} color='black' />
      </TouchableOpacity>
      {visible ? (
        <TouchableOpacity
          className='bg-primary_light z-20  rounded-2xl justify-center w-[95%] h-[100%] absolute'
          activeOpacity={1}
        >
          <Motion.View
            initial={{ x: -500 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className='bg-justify-center relative top-[10%]'
          >
            <Text style={styles.text_sm} className='text-center'>
              Press Ok to confirm
            </Text>
            <OdinaryButton
              style={"rounded-md text-blue-800"}
              navigate={() => {
                route.name == "tasks"
                  ? deleteTasks(id, name, duration).then((res) => {
                      console.log(res, "deleted task sucessfully");
                    })
                  : route.name == "jobs"
                  ? deleteJob(id).then((res) => {
                      console.log(res, "deleted job sucessfully");
                    })
                  : null;
                setVisible(!visible);
              }}
              text={"OK"}
            />
          </Motion.View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
