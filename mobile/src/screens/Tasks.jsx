import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { styles } from "../styles/stylesheet";
import { FontAwesome5 } from "@expo/vector-icons";
import LowerButton from "../components/LowerButton";
import SearchComponent from "../components/SearchComponent";
import DetailsCard from "../components/DetailsCard";
import UserDetails from "../components/UserDetails";
import JobDetails from "../components/JobDetails";
import TaskDetails from "../components/TaskDetails";
import { Modal } from "react-native";
import { setDuration } from "../store/slice-reducers/JobSlice";
import OdinaryButton from "../components/OdinaryButton";
import { updateAddress } from "../store/slice-reducers/Database";
import { getJobDetails, addTask } from "../api/Functions";
import { useRoute } from "@react-navigation/native";

export default function Tasks({ navigation }) {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [durations, setDurations] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { jobId, jobName, tasks, duration, category, no } = route.params;

  const [task, setTask] = useState(tasks);

  console.log(route.params.jobId);

  useEffect(() => {
    getJobDetails(jobId).then((res) => {
      setTask(res.tasks);
    });

    return () => {
      setRefreshing(false);
    };
  }, [refreshing, modalVisible]);

  const render = ({ item }) => {
    return (
      <View
        className='flex mb-1 border-b-[.5px] py-1 border-b-primary_light pl-2 flex-row'
        key={item.name}
      >
        <Text style={styles.text_sm} className='w-[50%] text-white'>
          {item.name}
        </Text>
        <Text style={styles.text_sm} className='w-[50%] text-white'>
          {item.duration}
        </Text>
      </View>
    );
  };
  return (
    <Background>
      <Topscreen
        onPress={() => {
          navigation.goBack();
        }}
        Edit={() => {
          navigation.navigate("CreateJob", {
            jobId: jobId,
            name2: jobName,
            duration2: duration,
            category2: category,
            no2: no,
          });
        }}
        text2={task.length}
        text3={duration}
        text={jobName}
      />

      <View
        className='bg-slate-200 h-[85vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent />
        </View>
        <View>
          <TaskDetails taskdata={task} jobId={jobId} />
        </View>
      </View>
      <LowerButton
        navigate={() => {
          setModalVisible(true);
        }}
        text={"Add/Edit Task"}
      />
      <Modal
        animationType='slide'
        className='h-[50vh]'
        onRequestClose={() => {
          setModalVisible(false);
        }}
        visible={modalVisible}
      >
        <View className='bg-primary pt-10 h-full'>
          <View className=' mb-10'>
            <View className='flex items-center justify-between self-center w-[90%] flex-row'>
              <Text className='text-Handler2' style={styles.text}>
                Name:
              </Text>
              <TextInput
                style={styles.averageText}
                onChangeText={(value) => {
                  setName(value);
                }}
                className='w-[65vw] bg-slate-300 mb-2 rounded-sm h-10'
              />
            </View>
            <View className='flex items-center justify-between self-center w-[90%] flex-row'>
              <Text className='text-Handler2' style={styles.text}>
                Duration:
              </Text>
              <TextInput
                style={styles.averageText}
                onChangeText={(value) => {
                  setDurations(value);
                }}
                className='w-[65vw] bg-slate-300 mb-2 rounded-sm h-10'
              />
            </View>
            <OdinaryButton
              text={"Add Task"}
              navigate={() => {
                addTask({ name: name, duration: durations }, jobId).then(
                  (resp) => {
                    console.log(resp);
                    getJobDetails(jobId).then((res) => {
                      setTask(res.tasks);
                    });
                  }
                );
                console.log(jobId);
              }}
              style={"mt-5 relative left-[15%]"}
            />
          </View>
          <View>
            <Text
              className='text-lg text-white underline ml-2'
              style={styles.text}
            >
              Tasks
            </Text>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                  }}
                />
              }
              data={task}
              renderItem={render}
              keyExtractor={(item) => item.name}
            />
          </View>
          <LowerButton text={"Done"} navigate={() => setModalVisible(false)} />
        </View>
      </Modal>
    </Background>
  );
}
