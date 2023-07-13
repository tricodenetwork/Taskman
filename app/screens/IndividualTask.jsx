import { View, Text } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { setCurrentTask, setHandler } from "../store/slice-reducers/ActiveJob";
import SelectComponent from "../components/SelectComponent";
import { AccountRealmContext } from "../models";
import { Account, holiday } from "../models/Account";
import Background from "../components/Background";
import { useCallback } from "react";
import { Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import OdinaryButton from "../components/OdinaryButton";
import { Motion } from "@legendapp/motion";
import { TouchableOpacity } from "react-native";

const { useRealm, useQuery } = AccountRealmContext;

export default function IndividualTask({ navigation }) {
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const Accounts = useQuery(Account);
  const { user } = useSelector((state) => state);
  const realm = useRealm();
  const route = useRoute();
  const job = realm.objectForPrimaryKey(
    "activejob",
    Realm.BSON.ObjectId(route.params.id)
  );

  const inProgess = job.tasks.filter(
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
        job?.tasks.map((task) => {
          const { name } = task;
          if (name == route.params.taskName) {
            // task.handler = handler;
            task.status = "InProgress";
            task.inProgress = new Date();
            alert("Task Activated! ✔");

            return;
          } else {
            return;
          }
        });
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });

    navigation.navigate("activetasks", { id: route.params.id });
  }, [realm, currenttask, handler]);
  const assignNextTask = useCallback(() => {
    realm.write(() => {
      try {
        job.tasks.map((task) => {
          const { name } = task;
          if (name == route.params.taskName) {
            task.handler = handler;
            task.status = "Pending";
            task.inProgress = null;
            alert(`${route.params.taskName} 📃 assigned to ${handler} 👤 `);
            return;
          }
        });
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });
    navigation.navigate("activetasks", { id: route.params.id });
  }, [realm, currenttask, handler]);

  return (
    <Background bgColor='min-h-screen'>
      <View className=' h-[70%] pt-[5vh] self-center flex justify-between items-center'>
        <Text
          className='self-center text-center w-[50vw]'
          style={[styles.text_sm2, { fontSize: actuatedNormalize(20) }]}
        >
          Assign Task
        </Text>

        <View className='h-[30vh] self-start px-[5vw] flex justify-around'>
          <SelectComponent
            value={route.params.taskName}
            title={"Tasks:"}
            placeholder={"Assign Next Task"}
          />
          <SelectComponent
            value={handler}
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
              inProgess ||
              isWeekend ||
              !isAllowedTime ||
              isTodayHoliday ||
              !route.params.taskHandler
                ? true
                : false
            }
            title='Activate'
            onPress={Activate}
            color={"#004343"}
          />
          <Button
            disabled={
              handler == "" || isWeekend || isTodayHoliday || !isAllowedTime
            }
            title='Assign'
            onPress={() => setVisible(!visible)}
          />
          <Button
            title='Back'
            onPress={() => {
              navigation.navigate("activetasks", {
                id: route.params.id,
              });
            }}
          />
        </View>
      </View>
    </Background>
  );
}
