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
    Realm.BSON.ObjectId(route.params.id)
  );
  const [task, setTask] = useState(job.job.tasks);
  const Accounts = useQuery(Account);
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const { user } = useSelector((state) => state);
  const foreignSupervisor = job.supervisor !== user.name ?? true;
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  const assignNextTask = useCallback(() => {
    // Perform the necessary actions to assign the next task and handler
    // based on the values of nextTask and nextHandler

    realm.write(() => {
      try {
        job.job.tasks.map((task) => {
          const { name } = task;

          if (name == currenttask) {
            task.handler = handler;
            task.status = "Pending";
            task.inProgress = null;
            alert("Next Task Assigned!");

            return;
          }
        });
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });

    // navigation.navigate("activejobs");
    setModalVisible(false);
  }, [realm, currenttask, handler]);

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
        text2={job ? job.job.tasks.length : item.supervisor}
        text3={job.duration}
        text={job.job.name}
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
          />
        </View>
      </View>
      {user.role !== "Client" && (
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
      )}
      <Modal visible={modalVisible}>
        <Background>
          <View className=' h-[70%] pt-[5vh] self-center flex justify-between items-center'>
            <Text
              className='self-center text-center w-[50vw]'
              style={[styles.text_sm2, { fontSize: actuatedNormalize(20) }]}
            >
              Assign Task
            </Text>

            <View className='h-[30vh] self-start px-[5vw] flex justify-around'>
              <SelectComponent
                value={currenttask}
                title={"Tasks:"}
                placeholder={"Assign Next Task"}
                data={job.job.tasks}
                setData={(params) => {
                  dispatch(setCurrentTask(params));
                }}
              />
              <SelectComponent
                value={handler}
                title={"Handler:"}
                placeholder={"Assign Next Handler"}
                data={Accounts.filter(
                  (obj) =>
                    (obj.role == "Handler") &
                    (obj.category?.name == user.category)
                )}
                setData={(params) => {
                  dispatch(setHandler(params));
                }}
              />
            </View>
            <View
              id='BUTTONS'
              className='flex justify-between align-bottom w-[50vw]  self-center flex-row'
            >
              <Button title='Submit' onPress={assignNextTask} />
              <Button
                title='Cancel'
                onPress={() => {
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </Background>
      </Modal>
    </Background>
  );
}
