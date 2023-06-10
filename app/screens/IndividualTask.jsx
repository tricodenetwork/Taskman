import { View, Text } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { setCurrentTask, setHandler } from "../store/slice-reducers/ActiveJob";
import SelectComponent from "../components/SelectComponent";
import { AccountRealmContext } from "../models";
import { Account } from "../models/Account";
import Background from "../components/Background";
import { useCallback } from "react";
import { Button } from "react-native";
import { useRoute } from "@react-navigation/native";

const { useRealm, useQuery } = AccountRealmContext;

export default function IndividualTask({ navigation }) {
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const Accounts = useQuery(Account);
  const { user } = useSelector((state) => state);
  const realm = useRealm();
  const route = useRoute();
  const job = realm.objectForPrimaryKey(
    "activejob",
    Realm.BSON.ObjectId(route.params.id)
  );

  const inProgess = job?.job.tasks.filter(
    (item) => item.name == route.params?.taskName
  )[0].inProgress;

  const Activate = useCallback(() => {
    // Perform the necessary actions to assign the next task and handler
    // based on the values of nextTask and nextHandler

    realm.write(() => {
      try {
        job?.job.tasks.map((task) => {
          const { name } = task;

          if (name == route.params.taskName) {
            task.handler = handler;
            task.status = "InProgress";
            task.inProgress = new Date();
            alert("Task Activated! ✔");

            return;
          }
        });
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });

    // navigation.navigate("activejobs");
    navigation.navigate("activeJobs");
  }, [realm, currenttask, handler]);
  const assignNextTask = useCallback(() => {
    // Perform the necessary actions to assign the next task and handler
    // based on the values of nextTask and nextHandler

    realm.write(() => {
      try {
        job.job.tasks.map((task) => {
          const { name } = task;

          if (name == route.params.taskName) {
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
    navigation.navigate("activetasks");
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
        <View
          id='BUTTONS'
          className='flex justify-between align-bottom w-[65vw]  self-center flex-row'
        >
          <Button
            disabled={inProgess || isWeekend || !isAllowedTime ? true : false}
            title='Activate'
            onPress={Activate}
            color={"#004343"}
          />
          <Button
            disabled={handler == "" || isWeekend || !isAllowedTime}
            title='Assign'
            onPress={assignNextTask}
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
