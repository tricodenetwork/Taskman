import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { setCurrentTask, setHandler } from "../store/slice-reducers/ActiveJob";
import SelectComponent from "../components/SelectComponent";
import { AccountRealmContext } from "../models";
import { Account, client, holiday } from "../models/Account";
import Background from "../components/Background";
import { useCallback } from "react";
import { Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import OdinaryButton from "../components/OdinaryButton";
import { Motion } from "@legendapp/motion";
import { TouchableOpacity } from "react-native";
import MultiSelect from "../components/MultiSelect";
import { activejob, job as jobs } from "../models/Task";
import { resetMulti, setMulti } from "../store/slice-reducers/App";

const { useRealm, useQuery } = AccountRealmContext;

export default function IndividualTask({ navigation }) {
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const Accounts = useQuery(Account);
  const clientsJob = useQuery(activejob);
  const datas = Array.from(clientsJob);
  const { user } = useSelector((state) => state);
  const { multipleJobs } = useSelector((state) => state.App);
  const realm = useRealm();
  const route = useRoute();
  const job = realm.objectForPrimaryKey(
    "activejob",
    Realm.BSON.ObjectId(route.params?.id)
  );
  const tasks = useQuery(jobs).filtered(`name == "Transcript"`)[0].tasks;

  const inProgress = job?.tasks.filter(
    (item) => item.name == route.params?.taskName
  )[0].inProgress;

  const holidas = useQuery(holiday);
  const isTodayHoliday = holidas.some((holiday) => {
    const holidayDate = new Date(holiday.day);
    const today = new Date();

    return (
      holidayDate.getFullYear() === today.getFullYear() &&
      holidayDate.getMonth() === today.getMonth() &&
      holidayDate.getDate() === today.getDate()
    );
  });

  const Activate = useCallback(() => {
    // Perform the necessary actions to activate a certain task and handler by setting it to InProgress

    realm.write(() => {
      try {
        if (multipleJobs.length !== 0) {
          multipleJobs.forEach((params) => {
            let tasks = clientsJob.filtered(`matno ==$0`, params)[0].tasks;
            for (let task of tasks) {
              if (
                task.name == route.params?.taskName ||
                task.name == currenttask
              ) {
                task.status = "InProgress";
                task.inProgress = new Date();
                break; // Breaks out of the loop
              }
            }
          });
          alert("Tasks Activated! ✔");
        } else {
          job?.tasks.map((task) => {
            const { name } = task;
            if (name == route.params.taskName) {
              // task.handler = handler;
              task.status = "InProgress";
              task.inProgress = new Date();

              return;
            } else {
              return;
            }
          });
          alert("Task Activated! ✔");
        }
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });

    // navigation.navigate("activetasks", { id: route.params?.id });
  }, [
    realm,
    currenttask,
    handler,
    multipleJobs,
    clientsJob,
    route.params?.taskName,
  ]);
  const assignNextTask = useCallback(() => {
    if (currenttask == "" && !route.params?.taskName) {
      alert("No task to assign");
      return;
    }

    realm.write(() => {
      try {
        if (multipleJobs.length != 0) {
          multipleJobs.forEach((params) => {
            let tasks = clientsJob.filtered(`matno ==$0`, params)[0].tasks;
            for (let task of tasks) {
              if (task.name == currenttask) {
                task.handler = handler;
                if (handler == "") {
                  task.status = "Pending";
                  task.started = null; // Ensure the start time is cleared if there's no handler
                } else {
                  task.status = "Awaiting";
                  task.started = new Date();
                }
                task.inProgress = null;
                break; // Breaks out of the loop
              }
            }
          });
          handler == ""
            ? alert(`${route.params.taskName} 📃 Unassigned `)
            : alert(`${route.params.taskName} 📃 assign to ${handler} 👤 `);
          return;
        } else {
          job?.tasks.map((task) => {
            const { name } = task;
            if (name == route.params?.taskName) {
              task.handler = handler;
              if (handler == "") {
                task.status = "Pending";
                task.started = null;
                task.inProgress = null;
                alert(`${route.params?.taskName} 📃 Unassigned Single`);
              } else {
                task.status = "Awaiting";
                task.started = new Date();
                task.inProgress = null;
                alert(
                  `${route.params?.taskName} 📃 assign to ${handler} single👤 `
                );
              }
              return;
            }
          });
        }
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });
    // navigation.navigate("activetasks", { id: route.params.id });
  }, [
    realm,
    currenttask,
    handler,
    multipleJobs,
    clientsJob,
    route.params?.taskName,
  ]);

  useEffect(() => {
    dispatch(setHandler(""));
    // return () => {};
  }, []);

  return (
    <Background bgColor=''>
      <View className=' h-[90%] pt-[5vh] self-center flex justify-between items-center'>
        <Text
          className='self-center text-center w-[50vw]'
          style={[styles.text_sm2, { fontSize: actuatedNormalize(20) }]}
        >
          Assign Task
        </Text>

        <View className='h-[50vh]   px-[5vw] flex justify-around'>
          <SelectComponent
            value={route.params?.taskName}
            title={"Tasks:"}
            setData={(params) => {
              dispatch(setCurrentTask(params));
            }}
            data={route.params ? null : tasks}
            placeholder={"Assign Next Task"}
          />
          <SelectComponent
            title={"Handler:"}
            placeholder={"Assign Next Handler"}
            data={Accounts.filter(
              (obj) =>
                (obj.role == "Handler") &
                (obj.category?.name == user.category.name)
            )}
            setData={(params) => {
              dispatch(setHandler(params));
            }}
          />
          {route.params?.taskName ? null : (
            <MultiSelect
              title={"ClientJobs:"}
              setData={(params) => {
                dispatch(setMulti(params));
              }}
              data={datas.sort(
                (a, b) => b._id.getTimestamp() - a._id.getTimestamp()
              )}
              placeholder={"Multiple"}
            />
          )}
        </View>
        {visible ? (
          <TouchableOpacity
            className='bg-primary_light rounded-2xl self-center absolute top-[5vh] justify-center w-[100%] h-[75%]'
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
                  assignNextTask();
                  setVisible(!visible);
                }}
                text={"OK"}
              />
            </Motion.View>
          </TouchableOpacity>
        ) : null}
        <View
          id='BUTTONS'
          className='flex justify-between align-bottom w-[65vw]  self-center flex-row'
        >
          <Button
            disabled={
              inProgress ||
              isWeekend ||
              !isAllowedTime ||
              isTodayHoliday ||
              handler == ""
                ? true
                : false
            }
            title='Activate'
            onPress={Activate}
            color={"#004343"}
          />
          <Button
            // disabled={handler == ""}
            title={handler == "" ? "Unassign" : "Assign"}
            onPress={() => setVisible(!visible)}
          />
          <Button
            title='Back'
            onPress={() => {
              route.params
                ? navigation.navigate("activetasks", {
                    id: route.params?.id,
                  })
                : navigation.goBack();
            }}
          />
        </View>
      </View>
    </Background>
  );
}
