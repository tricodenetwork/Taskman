import { View, Text } from "react-native";
import React from "react";
import { SCREEN_HEIGHT, actuatedNormalize, styles } from "../styles/stylesheet";
import { useRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const JobCard = ({ isActive, name, duration, category, tasks, id }) => {
  const route = useRoute();

  // const sumAll = useMemo(() => {
  //   return sumField(
  //     item.tasks ? item.tasks : item.job && item.tasks ? item.tasks : [],
  //     "duration"
  //   );
  // }, [item.tasks, item.job]);

  // const convert = useMemo(() => {
  //   return convertToMinutes(sumAll);
  // }, [sumAll]);

  // const sum = useMemo(() => {
  //   return formatDuration(convert);
  // }, [convert]);

  // useEffect(() => {
  //   if (!item.timeframe) {
  //     try {
  //       realm.write(() => {
  //         activeJobs.forEach((job) => {
  //           job.timeframe = sum;
  //         });
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }, []);

  // console.log(duration);

  const style = StyleSheet.create({
    text: { fontSize: actuatedNormalize(12) },
    bg: {
      backgroundColor: "rgba(45, 206, 214, 0.7)",
    },
    card: {
      height: 0.14 * SCREEN_HEIGHT,
      backgroundColor: isActive ? "pink" : "white",
    },
  });

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
          {name}
        </Text>
        {route.name == "jobs" && <Text>Tasks:{tasks}</Text>}
        <Text style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}>
          {`${duration?.days == null ? 0 : duration?.days}d ${
            duration?.hours == null ? 0 : duration?.hours
          }h ${duration?.minutes == null ? 0 : duration?.minutes}m`}
        </Text>
      </View>

      <Text
        style={[styles.averageText, style.text]}
        className='absolute text-Handler3 bottom-1 left-[22%]'
      >
        {category}
      </Text>
    </View>
  );
};

export default React.memo(JobCard);
