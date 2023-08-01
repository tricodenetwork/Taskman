import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
  Button,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { activejob } from "../models/Task";
import { useSelector } from "react-redux";

const { useRealm, useQuery } = AccountRealmContext;

export default function MyTasks({ navigation }) {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES
  const route = useRoute();
  const realm = useRealm();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState({ name: "", duration: "" });
  const [durations, setDurations] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const ActiveJobs = useQuery(activejob);
  const { user } = useSelector((state) => state);

  // const myTasks = ActiveJobs.map((job) => {
  //   const assigned =
  //     job?.tasks.filter((obj) => obj.handler === user.name) ?? [];
  //   assigned.map((obj) => {
  //     obj.id = job._id.toString();
  //     obj.job = job.job;
  //     obj.supervisor = job.supervisor;
  //     obj.matno = job.matno;
  //   });
  //   // const useThis = assigned.unshift(job._id);
  //   // console.log(assigned);
  //   return assigned;
  // });
  // const mergedTasks = myTasks.reduce((acc, obj) => acc.concat(obj), []);
  const myTasks = useMemo(
    () =>
      ActiveJobs.map((job) => {
        const assigned =
          job?.tasks.filter((obj) => obj.handler === user.name) ?? [];
        assigned.forEach((obj) => {
          obj.id = job._id.toString();
          obj.job = job.job;
          obj.supervisor = job.supervisor;
          obj.matno = job.matno;
        });
        return assigned;
      }),
    [ActiveJobs]
  );

  const mergedTasks = useMemo(
    () => myTasks.reduce((acc, obj) => acc.concat(obj), []),
    [myTasks]
  );

  //   console.log(myTasks);
  //   const myTask = myTasks.filter((obj) => obj.handler == "Justina Emelife");
  //   console.log(myTasks);

  const [task, setTask] = useState([]);

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  const render = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setEdit({ name: item.name, duration: item.duration });
          setName(item.name);
          setDurations(item.duration);
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
    <Background bgColor='min-h-[98vh]'>
      <Topscreen
        text={"My Tasks"}

        // Edit={() => {
        //   navigation.navigate("ActivateJob", {
        //     id: route.params.id,
        //   });
        // }}
      />

      <View
        className='bg-slate-200 h-[80vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent filterItems={["MatNo", "Status", "Supervisor"]} />
        </View>
        <View>
          <TaskDetails
            taskdata={mergedTasks}
            // jobId={route.params.id}
          />
        </View>
      </View>
    </Background>
  );
}
