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
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
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
import SelectComponent from "../components/SelectComponent";
import { Account } from "../models/Account";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTask, setHandler } from "../store/slice-reducers/ActiveJob";
import { setFilter } from "../store/slice-reducers/Formslice";

const { useRealm, useQuery } = AccountRealmContext;

export default function ActiveTasks({ navigation }) {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES
  const route = useRoute();
  const realm = useRealm();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [isNextTaskModalOpen, setIsNextTaskModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [edit, setEdit] = useState({ name: "", duration: "" });
  const [durations, setDurations] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const job = realm.objectForPrimaryKey(
    "activejob",
    Realm.BSON.ObjectId(route.params?.id)
  );
  const [task, setTask] = useState(job.tasks);
  const Accounts = useQuery(Account);
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const { user } = useSelector((state) => state);
  const foreignSupervisor = job.supervisor !== user.name ?? true;
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);
  // console.log(job.job.tasks);

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  useEffect(() => {
    dispatch(setFilter("Status"));
  });

  //----------------------------------------------------RENDERED COMPONENT
  return (
    <Background bgColor='min-h-screen'>
      <Topscreen
        Edit={() => {
          navigation.navigate("ActivateJob", {
            id: route.params.id,
          });
        }}
        text2={job ? job.tasks.length : item.supervisor}
        text3={job.job}
        text={job.matno}
      />

      <View
        className='bg-slate-200 h-[80vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent filterItems={["Status"]} />
        </View>
        <View>
          <TaskDetails
            foreignSupervisor={foreignSupervisor}
            reArrange={(e) => {
              reArrange(e);
            }}
            taskdata={task}
            jobId={route.params.id}
            clientId={job?.matno}
          />
        </View>
      </View>
      {/* {user.role !== "Client" && (
        <LowerButton
          disabled={
            foreignSupervisor || isWeekend || !isAllowedTime ? true : false
          }
          navigate={() => {
            setModalVisible(true);
          }}
          style={"w-[90vw]"}
          text={
            isWeekend || !isAllowedTime
              ? "Outside working hours!"
              : "Assign Task"
          }
        />
      )} */}
    </Background>
  );
}
