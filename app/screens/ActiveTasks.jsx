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
  const value = job.job.tasks.filtered(`name == $0 `, edit.name);
  const Accounts = useQuery(Account);
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const { user } = useSelector((state) => state);
  const foreignSupervisor = job.supervisor !== user.name ?? true;

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  useEffect(() => {
    setEdit({ name: "", duration: "" });
    return () => {
      setRefreshing(false);
    };
  }, [refreshing, modalVisible]);

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

        console.log("Assigned successully!");
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });

    // navigation.navigate("activejobs");
    setModalVisible(false);
  }, [realm, currenttask, handler]);

  const addTask = useCallback(
    (item) => {
      if (item.name == "") {
        alert("Name cannot be empty");
        return;
      }
      const index = job.job.tasks.findIndex((obj) => obj.name == item.name);

      if (value.length !== 0) {
        realm.write(() => {
          if (item.name)
            job.job.tasks.map((task) => {
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
          job.job.tasks.push(item);
          alert("Task added successfully!");
        });
      } else {
        alert("Task already exist");
        return;
      }

      setTask(job.job.tasks);
    },
    [realm, edit]
  );
  const deleteTask = useCallback(() => {
    realm.write(() => {
      // Alternatively if passing the ID as the argument to handleDeleteTask:
      // realm?.delete(value);

      const index = job.job.tasks.findIndex(
        (obj) => obj.name == edit.name && obj.duration == edit.duration
      );
      // setTask(job.job.tasks);
      console.log(index);

      if (index !== -1) {
        job.job.tasks.splice(index, 1);
        alert("Task deleted successfully!");

        setTask(job.job.tasks);
      }
    });
  }, [realm, edit]);
  const reArrange = useCallback(
    (array) => {
      if (!array) {
        return;
      }
      realm.write(() => {
        job.job.tasks = array;
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
          const value = job.job.tasks.filtered(
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
        text2={job ? job.job.tasks.length : item.supervisor}
        text3={job.duration}
        text={job.job.name}
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
      {user.role !== "Client" && (
        <LowerButton
          disabled={foreignSupervisor}
          navigate={() => {
            setModalVisible(true);
          }}
          text={"Assign Task"}
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
