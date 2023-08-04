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
import { useIsFocused, useRoute } from "@react-navigation/native";
import { AccountRealmContext } from "../models";
import { activejob } from "../models/Task";
import { useDispatch, useSelector } from "react-redux";
import { resetMulti } from "../store/slice-reducers/App";

const { useRealm, useQuery } = AccountRealmContext;

export default function MyTasks({ navigation }) {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES
  const route = useRoute();
  const realm = useRealm();
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const ActiveJobs = useQuery(activejob);
  const { user } = useSelector((state) => state);

  const myTasks = useMemo(
    () =>
      Array.from(ActiveJobs).map((job) => {
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
    [ActiveJobs, focus]
  );

  const mergedTasks = () => myTasks.reduce((acc, obj) => acc.concat(obj), []);

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  useEffect(() => {
    dispatch(resetMulti());
  }, [focus]);
  //----------------------------------------------------RENDERED COMPONENT
  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={"My Tasks"} />

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
