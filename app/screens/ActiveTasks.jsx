import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
  Button,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { actuatedNormalizeVertical, styles } from "../styles/stylesheet";
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
import { AccountRealmContext } from "../models";

const { useRealm, useQuery } = AccountRealmContext;

export default function ActiveTasks({ navigation }) {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES
  const route = useRoute();
  const realm = useRealm();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState({ name: "", duration: "" });
  const [durations, setDurations] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const job = realm.objectForPrimaryKey(
    "activejob",
    Realm.BSON.ObjectId(route.params.id)
  );
  const [task, setTask] = useState(job.tasks);
  const value = job.tasks.filtered(
    `name == $0 AND duration == $1`,
    edit.name,
    edit.duration
  );

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  useEffect(() => {
    setEdit({ name: "", duration: "" });
    return () => {
      setRefreshing(false);
    };
  }, [refreshing, modalVisible]);

  const addTask = useCallback(
    (item) => {
      if (item.name == "") {
        alert("Name cannot be empty");
        return;
      }
      const index = job.tasks.findIndex((obj) => obj.name == item.name);

      if (value.length !== 0) {
        realm.write(() => {
          if (item.name)
            job.tasks.map((task) => {
              const { name, duration } = task;

              if (name == edit.name && duration == edit.duration) {
                task.name = item.name;
                task.duration = item.duration;
                alert("Task edited successfully!");

                return;
              }
            });
        });
      } else if (index == -1) {
        realm.write(() => {
          job.tasks.push(item);
          alert("Task added successfully!");
        });
      } else {
        alert("Task already exist");
        return;
      }

      setTask(job.tasks);
    },
    [realm, edit]
  );
  const deleteTask = useCallback(() => {
    realm.write(() => {
      // Alternatively if passing the ID as the argument to handleDeleteTask:
      // realm?.delete(value);

      const index = job.tasks.findIndex(
        (obj) => obj.name == edit.name && obj.duration == edit.duration
      );
      // setTask(job.tasks);
      console.log(index);

      if (index !== -1) {
        job.tasks.splice(index, 1);
        alert("Task deleted successfully!");

        setTask(job.tasks);
      }
    });
  }, [realm, edit]);
  const reArrange = useCallback(
    (array) => {
      if (!array) {
        return;
      }
      realm.write(() => {
        job.tasks = array;
      });
    },
    [realm]
  );

  const render = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setEdit({ name: item.name, duration: item.duration });
          setName(item.name);
          setDurations(item.duration);
          const value = job.tasks.filtered(
            `name == $0 AND duration == $1`,
            item.name,
            item.duration
          );
          console.log(value);
        }}
      >
        <View
          style={{
            backgroundColor:
              edit.name == item.name && edit.duration == item.duration
                ? "pink"
                : "transparent",
          }}
          className='flex mb-1 border-b-[.5px] py-[1vh] border-b-primary_light  flex-row'
          key={item.name}
        >
          <Text style={styles.text_sm} className='w-[50%] text-left text-white'>
            {item.name}
          </Text>
          <Text style={styles.text_sm} className='w-[50%] text-white'>
            {`${item.duration} hrs`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //----------------------------------------------------RENDERED COMPONENT
  return (
    <Background>
      <Topscreen
        Edit={() => {
          navigation.navigate("ActivateJob", {
            id: route.params.id,
          });
        }}
        text2={job ? job.tasks.length : item.supervisor}
        text3={job.duration}
        text={job.job}
      />

      <View
        className='bg-slate-200 h-[80vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent />
        </View>
        <View>
          <TaskDetails
            reArrange={(e) => {
              reArrange(e);
            }}
            taskdata={task}
            jobId={route.params.id}
          />
        </View>
      </View>
      <LowerButton
        navigate={() => {
          setModalVisible(true);
        }}
        text={"Add Task"}
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
          <View className=' mb-[2vh]'>
            <View className='flex items-center justify-between self-center mb-[2vh] w-[90%] flex-row'>
              <Text className='text-Handler2' style={styles.text}>
                Name:
              </Text>
              <TextInput
                value={name}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
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
                value={durations}
                keyboardType='numeric'
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                onChangeText={(value) => {
                  setDurations(value);
                }}
                className='w-[65vw] bg-slate-300 mb-2 rounded-sm h-10'
              />
            </View>
            <View className='flex flex-row' style={[styles.Pcard]}>
              <OdinaryButton
                text={"Add"}
                navigate={() => {
                  addTask({ name: name, duration: durations });
                }}
                style={"mt-5 relative left-[15%]"}
              />
              <OdinaryButton
                text={"Delete"}
                navigate={() => {
                  deleteTask();
                }}
                style={"mt-5 relative left-[15%]"}
              />
            </View>
          </View>
          <View id='TASKS_CONTAINER' className='mx-[4vw]'>
            <Text className='text-white underline' style={styles.text}>
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
              style={{ height: "55%" }}
            />
          </View>
          <LowerButton text={"Done"} navigate={() => setModalVisible(false)} />
        </View>
      </Modal>
    </Background>
  );
}
