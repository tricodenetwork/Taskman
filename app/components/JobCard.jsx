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
  const status =
    item.status === "Pending"
      ? "gray"
      : item.status === "InProgress"
      ? "#FFD700"
      : item.status === "InProgress"
      ? "#ff4747"
      : item.status === "Completed"
      ? "green"
      : null;

  // useEffect(() => {
  //   // realm.write(() => {
  //   //   realm.delete(realm.objects("activejob"));
  //   // });
  //   // realm.refresh();
  // });

  const sumAll = sumField(
    item.tasks ? item.tasks : item.job && item.job.tasks ? item.job.tasks : [],
    "duration"
  );

  const convert = convertToMinutes(sumAll);
  const sum = formatDuration(convert);

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
          {(item.name && item.name) || (item.matno && item.matno)}
        </Text>
        {/* {item.dept ? <Text>{item.dept}</Text> : null} */}
        {route.name == "jobs" ? (
          <Text>Tasks:{item.tasks.length}</Text>
        ) : (
          <Text>{item.job && item.job.name}</Text>
        )}
        <Text style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}>
          {route.name == "tasks"
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
      <Text className='text-[12px] absolute text-Handler3 bottom-1 left-[22%]'>
        {item.supervisor && item.supervisor}
      </Text>
      <Text className='text-[12px] absolute text-Handler3 bottom-1 left-[22%]'>
        {item.category && item.category.name}
      </Text>
      {route.name == "activeJobs" && (
        <View
          style={{
            backgroundColor: status,
            borderColor: status,
            borderWidth: 1,
          }}
          className={` rounded-md  py-2 w-[21vw]`}
        >
          <Text
            style={[styles.text_md, { fontSize: actuatedNormalize(10) }]}
            className={`${status} text-center`}
          >
            {item.status && item.status.toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
}
