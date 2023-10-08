import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import OdinaryButton from "../../components/OdinaryButton";
import { Motion } from "@legendapp/motion";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../../styles/stylesheet";
import { useRoute } from "@react-navigation/native";
import {
  setCurrentTask,
  setHandler,
  setPassword,
} from "../../store/slice-reducers/ActiveJob";
import { batch, useDispatch, useSelector } from "react-redux";
import { millisecondSinceStartDate } from "../../api/main";
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
  const { user } = useSelector((state) => state);

  const { multipleJobs } = useSelector((state) => state.App);

  const route = useRoute();
  const update = route.params?.update;
  const { activeJob, ActiveJobs, tasks, handlers, pushToken, globe } =
    useRealmData(route.params);

  const resetField = () => {
    batch(() => {
      dispatch(setCurrentTask(""));
      dispatch(setHandler(""));
    });
  };
  const updateTime = useCallback(
    (item) => {
      const TimeExist = globe !== undefined;

      if (TimeExist) {
        globe.update_time = new Date();
        globe.mut = Date.now();
        return;
      }
      const newUpdate = { update_time: new Date(), mut: Date.now() };
      try {
        return new global(realm, newUpdate);
      } catch (error) {
        console.log({ error, msg: "Error updatig time" });
      }
    },
    [realm]
  );

  const cantClickDone = (tasks, taskname) => {
    // Check if the task with taskname is the last task

    if (activeJob?.tasks == undefined) {
      return;
    }
    const isLastTask = tasks[tasks?.length - 1]?.name === taskname;
    const inputField = handler == "" || currenttask == "";

    // Check all tasks' statuses
    return (
      tasks.every((task) => {
        if (task.name == taskname) {
          return true;
        }
        return (
          task.status !== "InProgress" &&
          task.status !== "Overdue" &&
          task.status !== "Awaiting"
        );
      }) &&
      !isLastTask &&
      inputField
    );
  };

  const doneCondition = cantClickDone(activeJob?.tasks, route.params?.name);
  // Create a chat room

  const filterMultipleJobs = (ActiveJobs, param) => {
    return ActiveJobs.filtered(`matno ==$0`, param)[0]?.tasks;
  };

  const handleNextTaskSubmit = useCallback(() => {
    // Perform the necessary actions to assign the next task and handler
    // based on the values of nextTask and nextHandler
    if (user.role !== "Handler") {
      alert("Unauthorized Handler!! ❌.");
      return;
    }
    if (handler == "") {
      alert("No Handler selected!! ❌.");
      return;
    }
    if (currenttask == "") {
      alert("No task selected!! ❌.");
      return;
    }

    realm.write(() => {
      try {
        if (multipleJobs.length !== 0) {
          multipleJobs.forEach((params) => {
            filterMultipleJobs(ActiveJobs, params).map((task) => {
              // on handling next task, first of all set your current task to completed
              if (task.name == password && task.handler == user.name) {
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
          alert("Task Completed! ✔");
        }
        updateTime();
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });
    update && update([]);
    resetField();
    dispatch(resetMulti());
    dispatch(setPassword(""));

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

  useEffect(() => {
    resetField();
  }, []);

  return (
    <Background>
      <View className=' h-[90%]  pt-[5vh] flex justify-between items-center'>
        <View className='w-screen'>
          <Text
            className='self-center  text-center '
            style={[
              styles.text_sm2,
              {
                fontSize: actuatedNormalize(20),
                lineHeight: actuatedNormalizeVertical(20 * 1.5),
              },
            ]}
          >
            Assign Task
          </Text>
          <Text
            className='self-center mt-3  text-center w-full'
            style={[
              styles.text_sm2,
              {
                fontSize: actuatedNormalize(18),
                lineHeight: actuatedNormalizeVertical(18 * 1.5),
              },
            ]}
          >
            {route.params?.matno}
          </Text>
        </View>
        <View className='h-[50vh] self-start px-[5vw] flex justify-around'>
          <SelectComponent
            title={"Tasks:"}
            placeholder={"Assign Next Task"}
            data={
              route.params
                ? activeJob?.tasks.filter(
                    (obj) =>
                      (obj.status == "Pending" || obj.status == "") &&
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
          <View
            className='bg-primary_light rounded-2xl self-center absolute top-[12vh] justify-center w-[90%] h-[55%]'
            // activeOpacity={1}
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
          </View>
        ) : null}
        <View
          id='BUTTONS'
          className='flex justify-between align-bottom w-[50vw]  self-center flex-row'
        >
          <OdinaryButton
            disabled={doneCondition}
            text={handler == "" && currenttask == "" ? "Done" : "Assign"}
            bg={handler == "" && currenttask == "" ? "#006400" : "#E57310"}
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
