import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { AntDesign } from "@expo/vector-icons";
import OdinaryButton from "./OdinaryButton";
import { Motion } from "@legendapp/motion";
import { useRoute } from "@react-navigation/native";
import { AccountRealmContext } from "../models";
import { sumField, formatDuration, convertToMinutes } from "../api/Functions";

const { useRealm, useQuery } = AccountRealmContext;

export default function JobCard({ isActive, id, name, item }) {
  const [visible, setVisible] = useState(false);
  const route = useRoute();
  const realm = useRealm();

  // useEffect(() => {
  //   // realm.write(() => {
  //   //   realm.delete(realm.objects("activejob"));
  //   // });
  //   // realm.refresh();
  // });

  const sumAll = sumField(item.tasks ? item.tasks : [], "duration");
  const convert = convertToMinutes(sumAll);
  const sum = formatDuration(convert);
  // const sum = { days: 19, hours: 3, minutes: 45 };
  // console.log(item);

  return (
    <View
      style={[styles.Pcard, { backgroundColor: isActive ? "pink" : "white" }]}
      className='bg-white flex-row   rounded-2xl mb-5 self-center w-[90vw] h-[14vh] px-[7] items-center justify-between'
    >
      <View
        style={{
          backgroundColor: "rgba(45, 206, 214, 0.7)",
        }}
        className={`bg-blue-500 absolute w-[1vw] rounded-full left-[-2px] h-[60%]`}
      ></View>
      {/* <Image source={require("../../assets/images/user_pic.png")} /> */}

      <View className='text-left  w-[70%] pl-[1vw]'>
        <Text style={styles.text_md2} className='text-primary'>
          {item.name && item.name}
          {item.matNo && item.matNo}
        </Text>
        {/* {item.dept ? <Text>{item.dept}</Text> : null} */}
        {/* {tasks ? <Text>Tasks:{tasks}</Text> : null} */}
        <Text style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}>
          {!item.tasks
            ? `${`${item.duration.days == null ? 0 : item.duration.days}d ${
                item.duration.hours == null ? 0 : item.duration.hours
              }h ${
                item.duration.minutes == null ? 0 : item.duration.minutes
              }m`}`
            : `${`${sum.days == null ? 0 : sum.days}d ${
                sum.hours == null ? 0 : sum.hours
              }h ${sum.minutes == null ? 0 : sum.minutes}m`}`}
          {/* {item.name} */}
        </Text>
      </View>

      {route.name == "jobs" && (
        <TouchableOpacity
          onPress={() => {
            setVisible(!visible);
          }}
        >
          <AntDesign name='delete' size={actuatedNormalize(23)} color='black' />
        </TouchableOpacity>
      )}

      {/* // Delete iconp */}
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
              style={"rounded-md mt-4 bg-primary text-slate-200"}
              navigate={() => {
                route.name == "tasks"
                  ? deleteTask()
                  : route.name == "jobs"
                  ? deleteJob(id)
                  : null;
                setVisible(!visible);
              }}
              text={"OK"}
            />
          </Motion.View>
        </TouchableOpacity>
      ) : null}
      <Text className='text-[12px] absolute text-Handler3 bottom-1 left-[25%]'>
        {item.supervisor && item.supervisor}
      </Text>
    </View>
  );
}
;