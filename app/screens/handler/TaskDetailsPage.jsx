import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { View, Text } from "react-native";
import { styles } from "../../styles/stylesheet";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import SelectComponent from "../../components/SelectComponent";
import { AccountRealmContext } from "../../models";
import {
  setCurrentTask,
  setHandler,
  setPassword,
} from "../../store/slice-reducers/ActiveJob";
import { batch, useDispatch, useSelector } from "react-redux";
import { resetMulti, setMulti } from "../../store/slice-reducers/App";
import useRealmData from "../../hooks/useRealmData";
import MultiSelect from "../../components/MultiSelect";
import OdinaryButton from "../../components/OdinaryButton";
import { global } from "../../models/Account";

const { useRealm } = AccountRealmContext;

const TaskDetailsPage = () => {
  const { currenttask, handler, password } = useSelector(
    (state) => state.ActiveJob
  );
  const { user } = useSelector((state) => state);
  const route = useRoute();
  const realm = useRealm();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { multipleJobs } = useSelector((state) => state.App);
  const update = route.params?.update;
  const { activeJob, ActiveJobs, uniqueTasks, globe } = useRealmData(
    route.params
  );
  let clientDetails = null;
  if (route.params) {
    clientDetails = (
      <View className='h-[50vh] flex justify-around'>
        <Text style={[styles.text_md]}>ClientId: {route.params?.matno}</Text>
        <Text style={[styles.text_md]}>
          Supervisor: {route.params?.supervisor}
        </Text>
        <Text style={[styles.text_md]}>Task: {route.params?.name}</Text>
      </View>
    );
  }
  const disableButton =
    // isWeekend ||
    // !isAllowedTime ||
    (route.params == undefined && multipleJobs.length == 0) ||
    (route.params == undefined && password == "");

  const resetField = () => {
    batch(() => {
      dispatch(setCurrentTask(""));
      dispatch(setHandler(""));
      dispatch(resetMulti());
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

  useEffect(() => {
    resetField();
  }, []);

  // Functions and Buttons to accept, assign and reject tasks
  const handleAcceptButton = useCallback(() => {
    // Perform the necessary actions to accept task
    // based on the values of nextTask and nextHandler

    if (user.role !== "Handler") {
      alert("Unauthorized Handler!! ❌.");
    }

    realm.write(() => {
      try {
        if (multipleJobs.length !== 0) {
          multipleJobs.forEach((params) => {
            ActiveJobs.filtered(`matno ==$0`, params)[0]?.tasks.map((task) => {
              // Set task to inProgress and begin counting
              if (task.name == password && task.handler == user.name) {
                task.status = "InProgress";
                task.inProgress = new Date();
              }
            });
          });
        } else {
          activeJob?.tasks.map((task) => {
            // Set task to inProgress and begin counting
            if (
              task.name == route.params?.name &&
              task.handler == route.params?.handler
            ) {
              task.status = "InProgress";
              task.inProgress = new Date();
            }
          });
        }
        alert("Task Accepted! ✔");
        updateTime();
      } catch (error) {
        console.log({ error, msg: "Error Accepting Task" });
        alert("Error accepting message");
      }
    });
    update && update([]);
    resetField();
    navigation.navigate("mytasks");
  }, [
    realm,
    currenttask,
    route.params?.handler,
    multipleJobs,
    ActiveJobs,
    handler,
  ]);

  return (
    <Background bgColor='min-h-screen bg-white'>
      <Topscreen text={route.params?.job} text3={route.params?.matno} />
      <View className='h-[75vh] absolute bottom-5 bg-white w-full flex items-start pb-[3vh] pt-[5vh] px-[3vw] justify-between'>
        {/* Display the task details */}
        <View>
          {route.params ? null : (
            <SelectComponent
              title={"Task:"}
              placeholder={"Select Task"}
              data={uniqueTasks}
              setData={(params) => {
                dispatch(setPassword(params));
              }}
            />
          )}
          {route.params ? null : (
            <MultiSelect
              title={"Jobs:"}
              setData={(params) => {
                dispatch(setMulti(params));
              }}
              data={Array.from(ActiveJobs).sort(
                (a, b) => b._id.getTimestamp() - a._id.getTimestamp()
              )}
              placeholder={"Multiple"}
            />
          )}
        </View>
        {clientDetails}
        <View
          id='BUTTONS'
          className='flex justify-around w-[80vw] self-center flex-row'
        >
          {/* Accept button */}
          <OdinaryButton
            disabled={
              route.params?.status == "InProgress" ||
              route.params?.status == "Completed" ||
              route.params?.status == "Overdue" ||
              disableButton
            }
            bg={"#FF925C"}
            text='Accept'
            navigate={() => {
              handleAcceptButton();
            }}
          />
          {/* Done button */}
          <OdinaryButton
            disabled={
              route.params?.status == "Completed" ||
              route.params?.status == "Awaiting" ||
              route.params?.status == "Pending" ||
              disableButton
            }
            bg={"#006400"}
            text='Done'
            navigate={() => {
              navigation.navigate("taskdone", route.params);
            }}
          />

          {/* Error button */}
          {route.params !== undefined && (
            <OdinaryButton
              disabled={route.params?.status == "Completed"}
              bg={"#ff4747"}
              text='Reject'
              navigate={() => {
                navigation.navigate("reject", route.params);
              }}
            />
          )}
        </View>
      </View>
    </Background>
  );
};

export default TaskDetailsPage;
