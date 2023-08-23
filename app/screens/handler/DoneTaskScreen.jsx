import React, { useCallback, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import OdinaryButton from "../../components/OdinaryButton";
import { Motion } from "@legendapp/motion";
import { TouchableOpacity } from "react-native-gesture-handler";
import { actuatedNormalize, styles } from "../../styles/stylesheet";
import { useRoute } from "@react-navigation/native";
import {
  setCurrentTask,
  setHandler,
  setPassword,
} from "../../store/slice-reducers/ActiveJob";
import { batch, useDispatch, useSelector } from "react-redux";
import { millisecondSinceStartDate } from "../../api/test";
import { sendPushNotification } from "../../api/Functions";
import useRealmData from "../../hooks/useRealmData";
import { AccountRealmContext } from "../../models";
import Background from "../../components/Background";
import SelectComponent from "../../components/SelectComponent";
import { Text } from "react-native";
import { resetMulti } from "../../store/slice-reducers/App";

const { useRealm } = AccountRealmContext;

const DoneTaskScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const realm = useRealm();
  const { currenttask, handler, password } = useSelector(
    (state) => state.ActiveJob
  );
  const { multipleJobs } = useSelector((state) => state.App);

  const route = useRoute();
  const { activeJob, ActiveJobs, tasks, handlers, pushToken } = useRealmData(
    route.params
  );

  const resetField = batch(() => {
    dispatch(setCurrentTask(""));
    dispatch(setHandler(""));
    dispatch(resetMulti());
    dispatch(setPassword(""));
  });
  // Create a chat room

  const filterMultipleJobs = (ActiveJobs, param) => {
    return ActiveJobs.filtered(`matno ==$0`, param)[0]?.tasks;
  };

  const handleNextTaskSubmit = useCallback(() => {
    // Perform the necessary actions to assign the next task and handler
    // based on the values of nextTask and nextHandler

    if (user.role !== "Handler") {
      alert("Unauthorized Handler!! ❌.");
    }

    realm.write(() => {
      try {
        if (multipleJobs.length !== 0) {
          multipleJobs.forEach((params) => {
            filterMultipleJobs(ActiveJobs, params).map((task) => {
              // on handling next task, first of all set your current task to completed
              if ((task.name == password) & (task.handler == user.name)) {
                const timeCompleted = millisecondSinceStartDate(
                  task.inProgress
                );

                task.status =
                  tasks.status == "Awaiting" ? "Awaiting" : "Completed";
                task.finished = new Date();
                task.completedIn = task.completedIn
                  ? new Date(timeCompleted + task.completedIn)
                  : new Date(timeCompleted);
              }

              // then set next handler...
              if (task.name == currenttask) {
                task.handler = handler;
                task.status = "Awaiting";
                task.started = new Date();
                sendPushNotification(pushToken, task.name);
              }
            });
          });
          alert("Task Completed! ✔ multi");
        } else {
          activeJob?.tasks.map((task) => {
            // on handling next task, first of all set your current task to completed
            if (
              task.name === route.params?.name &&
              task.handler === route.params?.handler
            ) {
              const timeCompleted = millisecondSinceStartDate(task.inProgress);

              task.status = "Completed";
              task.finished = new Date();
              task.completedIn = task.completedIn
                ? new Date(timeCompleted + task.completedIn)
                : new Date(timeCompleted);
            }

            // then set next handler...
            if (task.name == currenttask) {
              task.handler = handler;
              task.status = "Awaiting";
              task.started = new Date();
              sendPushNotification(pushToken, task.name);
            }
          });
          alert("Task Completed! ✔ single");
          update([]);
        }
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });
    resetField();
    navigation.navigate("mytasks");
    // setIsNextTaskModalOpen(false);
  }, [
    realm,
    currenttask,
    multipleJobs,
    ActiveJobs,
    route.params?.handler,
    handler,
    route.params?.name,
    password,
  ]);

  return (
    <Background>
      <View className=' h-[90%] pt-[5vh] flex justify-between items-center'>
        <Text
          className=' w-[50vw]'
          style={[styles.text_sm2, { fontSize: actuatedNormalize(20) }]}
        >
          Assign Next Task
        </Text>

        <View className='h-[50vh] self-start px-[5vw] flex justify-around'>
          <SelectComponent
            title={"Tasks:"}
            placeholder={"Assign Next Task"}
            data={
              route.params
                ? activeJob?.tasks.filter(
                    (obj) =>
                      (obj.status == "Pending" || obj.status == "") &
                      (obj.handler == "" || obj.handler == null)
                  )
                : tasks
            }
            setData={(params) => {
              dispatch(setCurrentTask(params));
            }}
          />

          <SelectComponent
            title={"Handler:"}
            placeholder={"Assign Next Handler"}
            data={handlers}
            setData={(params) => {
              dispatch(setHandler(params));
            }}
          />
        </View>
        {visible ? (
          <TouchableOpacity
            className='bg-primary_light rounded-2xl self-center absolute top-[12vh] justify-center w-[90%] h-[55%]'
            activeOpacity={1}
          >
            <Motion.View
              initial={{ x: -500 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className='justify-center h-full  w-full  flex self-center'
            >
              <Text style={styles.text_sm} className='text-center mb-2'>
                Press Ok to confirm
              </Text>
              <OdinaryButton
                style={"rounded-sm mt-4 bg-primary"}
                navigate={() => {
                  handleNextTaskSubmit();
                  setVisible(!visible);
                }}
                text={"OK"}
              />
            </Motion.View>
          </TouchableOpacity>
        ) : null}
        <View
          id='BUTTONS'
          className='flex justify-between align-bottom w-[50vw]  self-center flex-row'
        >
          <OdinaryButton
            disabled={handler == "" || currenttask == ""}
            text='Assign'
            bg={"#E57310"}
            navigate={() => setVisible(!visible)}
          />
          <OdinaryButton
            bg={"#ff4747"}
            text='Cancel'
            navigate={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </Background>
  );
};

export default DoneTaskScreen;
