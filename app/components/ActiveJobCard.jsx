import { View, Text } from "react-native";
import React from "react";
import {
  SCREEN_HEIGHT,
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import { useRoute } from "@react-navigation/native";
import { AccountRealmContext } from "../models";
import { formatDate, objectIdToDate } from "../api/Functions";
import { StyleSheet } from "react-native";

const { useRealm } = AccountRealmContext;

const ActiveJobCard = ({ id }) => {
  const route = useRoute();
  const realm = useRealm();
  const item =
    route.name == "activeJobs"
      ? realm.objectForPrimaryKey("activejob", Realm.BSON.ObjectId(id))
      : realm.objectForPrimaryKey("job", Realm.BSON.ObjectId(id));
  const status =
    item.status === "Pending"
      ? "gray"
      : item.status === "InProgress"
      ? "#FFD700"
      : item.status === "Awaiting"
      ? "#FF925C"
      : item.status === "Completed"
      ? "green"
      : item.status === "Overdue"
      ? "#ff4747"
      : null;

  return (
    <View
      style={[styles.Pcard, style.card]}
      className='bg-white flex-row rounded-2xl self-center w-[90vw] px-[7] items-center justify-between'
    >
      <View
        style={style.bg}
        className={`bg-[rgba(45, 206, 214, 0.7)] absolute w-[1vw] rounded-full left-[-2px] h-[60%]`}
      ></View>
      <View className='text-left  w-[70%] pl-[1vw]'>
        <Text style={styles.text_md2} className='text-primary'>
          {item.matno}
        </Text>

        <Text
          style={[
            styles.averageText,
            { paddingLeft: 0, fontSize: actuatedNormalize(14) },
          ]}
        >
          {item.job}
        </Text>
        <Text style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}>
          {`${item.timeframe?.days}d ${item.timeframe?.hours}h ${item.timeframe?.minutes}m`}
        </Text>
      </View>
      <Text
        style={[styles.averageText, style.text]}
        className='absolute text-Handler3 bottom-1 left-[22%]'
      >
        {item.supervisor}
      </Text>
      <Text
        style={[styles.averageText, style.text]}
        className='absolute text-Handler3 bottom-1 left-[22%]'
      >
        {item.category?.name}
      </Text>
      <View className='relative h-full flex items-center justify-around'>
        <Text
          style={[
            styles.text_md,
            {
              fontSize: actuatedNormalize(10),
              lineHeight: actuatedNormalizeVertical(18),
              color: status,
            },
          ]}
          className={`text-Handler3 w-[70%]  self-center text-center`}
        >
          {formatDate(objectIdToDate(id))}
        </Text>
        <View
          style={{
            backgroundColor: status,
            borderColor: status,
            borderWidth: 1,
          }}
          className={` rounded-md  py-[1vh] w-[21vw]`}
        >
          <Text
            style={[styles.text_md, { fontSize: actuatedNormalize(10) }]}
            className={`${status} text-center`}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(ActiveJobCard);
const style = StyleSheet.create({
  text: { fontSize: actuatedNormalize(12) },
  bg: {
    backgroundColor: "rgba(45, 206, 214, 0.7)",
  },
  card: {
    height: 0.14 * SCREEN_HEIGHT,
    // backgroundColor: isActive ? "pink" : "white",
  },
});
