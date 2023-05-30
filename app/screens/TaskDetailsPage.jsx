import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import SelectComponent from "../components/SelectComponent";
import { activejob } from "../models/Task";
import { AccountRealmContext } from "../models";
import { setCurrentTask, setHandler } from "../store/slice-reducers/ActiveJob";
import { useDispatch, useSelector } from "react-redux";
import { Account } from "../models/Account";

const { useRealm, useQuery, useObject } = AccountRealmContext;

const TaskDetailsPage = () => {
  const [isNextTaskModalOpen, setIsNextTaskModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [nextTask, setNextTask] = useState("");
  const [nextHandler, setNextHandler] = useState("");
  const [previousHandler, setPreviousHandler] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const route = useRoute();
  const realm = useRealm();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { taskInfo, id } = route.params;
  const Tasks = useObject(activejob, taskInfo.id);
  const Accounts = useQuery(Account);

  function calculateInterval(hours) {
    // Convert hours to milliseconds
    const milliseconds = hours * 60 * 60 * 1000;

    // Get the current time
    const startTime = Date.now();

    // Calculate the target time by adding the milliseconds to the start time
    const targetTime = startTime + milliseconds;

    // Set up the interval to update the remaining time every second
    const interval = setInterval(() => {
      // Get the current time
      const currentTime = Date.now();

      // Calculate the remaining time in milliseconds
      const remainingTime = targetTime - currentTime;

      // Calculate the remaining hours, minutes, and seconds
      const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
      const remainingMinutes = Math.floor(
        (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
      );
      const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

      // Display the remaining time
      const Timer = `${remainingHours}:${remainingMinutes}:${remainingSeconds}`;

      realm.write(() => {
        try {
          Tasks.tasks.map((task) => {
            const { name } = task;

            if (
              (task.status == "Completed") &
              (name == taskInfo.name) &
              (task.handler == taskInfo.handler)
            ) {
              // Check if the remaining time is less than or equal to zero
              clearInterval(interval);
              console.log("Task Completed!");
              return;
            } else if (
              (name == taskInfo.name) &
              (task.handler == taskInfo.handler) &
              (task.status == "InProgress")
            ) {
              task.timer = Timer;
            }

            return;
          });
        } catch (error) {
          console.log({ error, msg: "Error updating Timer" });
        }
      });
    }, 1000);
  }

  const handleAcceptButton = useCallback(() => {
    // Perform the necessary actions to accept task

    realm.write(() => {
      try {
        Tasks.tasks.map((task) => {
          const { name } = task;

          if ((name == taskInfo.name) & (task.handler == taskInfo.handler)) {
            task.status = "InProgress";
            task.inProgress = new Date(Date.now());
          }

          return;
        });
        alert("Task Accepted!");

        console.log("Accepted successully!");
      } catch (error) {
        console.log({ error, msg: "Error Accepting Task" });
      }
    });

    calculateInterval(taskInfo.duration);

    navigation.navigate("mytasks");
    setIsNextTaskModalOpen(false);
  }, [realm, currenttask, handler]);

  const handleDoneButton = () => {
    setIsNextTaskModalOpen(true);
  };

  const handleErrorButton = () => {
    setIsErrorModalOpen(true);
  };

  const handleNextTaskSubmit = useCallback(() => {
    // Perform the necessary actions to assign the next task and handler
    // based on the values of nextTask and nextHandler

    realm.write(() => {
      try {
        Tasks.tasks.map((task) => {
          const { name } = task;

          if ((name == taskInfo.name) & (task.handler == taskInfo.handler)) {
            task.status = "Completed";
            task.completedIn = new Date(Date.now());
          }
          if (name == currenttask) {
            task.handler = handler;
            alert("Next Task Assigned!");

            return;
          }
        });

        console.log("Assigned successully!");
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });

    navigation.navigate("mytasks");
    setIsNextTaskModalOpen(false);
  }, [realm, currenttask, handler]);

  const handleErrorSubmit = () => {
    // Perform the necessary actions to send the task back to the previous handler
    // and send the error message to the supervisor
    setIsErrorModalOpen(false);
  };

  return (
    <Background>
      <Topscreen text={taskInfo.job} />
      <View className='h-[75vh] absolute bottom-0 bg-white w-full flex items-start pb-[3vh] pt-[5vh] px-[3vw] justify-between'>
        {/* Display the task details */}
        <Text style={[styles.text_md]}>Id: {taskInfo.id.toString()}</Text>
        <Text style={[styles.text_md]}>MatNo: {taskInfo.matNo}</Text>
        <Text style={[styles.text_md]}>Supervisor: {taskInfo.supervisor}</Text>
        <Text style={[styles.text_md]}>Task: {taskInfo.name}</Text>
        {/* <Text style={[styles.text_md]}>Job: {taskInfo.job}</Text> */}
        <Text style={[styles.text_sm2]}>Timer: {taskInfo.timer}</Text>

        <View
          id='BUTTONS'
          className='flex justify-around w-[80vw] self-center flex-row'
        >
          {/* Accept button */}
          <Button
            disabled={
              taskInfo.status == "InProgress" || taskInfo.status == "Completed"
                ? true
                : false
            }
            color={"#00a3a3"}
            title='Accept'
            onPress={handleAcceptButton}
          />
          {/* Done button */}
          <Button
            disabled={taskInfo.status == "Completed" && true}
            color={"#004343"}
            title='Done'
            onPress={handleDoneButton}
          />

          {/* Error button */}
          <Button
            disabled={taskInfo.status == "Completed" && true}
            color={"#E59F71"}
            title='Error'
            onPress={handleErrorButton}
          />
        </View>

        {/* Next task modal */}
        <Modal visible={isNextTaskModalOpen}>
          <Background>
            <View className=' h-[70%] pt-[5vh] flex justify-between items-center'>
              <Text
                className=' w-[50vw]'
                style={[styles.text_sm2, { fontSize: actuatedNormalize(20) }]}
              >
                Assign Next Task
              </Text>

              <View className='h-[30vh] self-start px-[5vw] flex justify-around'>
                <SelectComponent
                  title={"Tasks:"}
                  placeholder={"Assign Next Task"}
                  data={Tasks.tasks.filter((obj) => obj.status == "Pending")}
                  setData={(params) => {
                    dispatch(setCurrentTask(params));
                  }}
                />
                <SelectComponent
                  title={"Handler:"}
                  placeholder={"Assign Next Handler"}
                  data={Accounts.filter((obj) => obj.role == "Handler")}
                  setData={(params) => {
                    dispatch(setHandler(params));
                  }}
                />
              </View>
              <View
                id='BUTTONS'
                className='flex justify-between align-bottom w-[50vw]  self-center flex-row'
              >
                <Button title='Submit' onPress={handleNextTaskSubmit} />
                <Button
                  title='Cancel'
                  onPress={() => {
                    setIsNextTaskModalOpen(false);
                  }}
                />
              </View>
            </View>
          </Background>
        </Modal>

        {/* Error modal */}
        <Modal visible={isErrorModalOpen}>
          <Background>
            <View className=' h-[70%] pt-[5vh] flex justify-between items-center'>
              <Text
                className=' w-[50vw]'
                style={[styles.text_sm2, { fontSize: actuatedNormalize(20) }]}
              >
                Report Error
              </Text>

              <View className='h-[30vh] self-start px-[5vw] flex justify-around'>
                <SelectComponent
                  title={"Tasks"}
                  placeholder={"Assign Next Task"}
                  data={Tasks.tasks.filter((obj) => obj.status == "Pending")}
                  setData={(params) => {
                    dispatch(setCurrentTask(params));
                  }}
                />
                <SelectComponent
                  title={"Handler"}
                  placeholder={"Assign Next Handler"}
                  data={Accounts.filter((obj) => obj.role == "Handler")}
                  setData={(params) => {
                    dispatch(setHandler(params));
                  }}
                />
              </View>
              <TextInput
                multiline={true}
                placeholder='Error Message to Supervisor'
                value={errorMessage}
                className='w-[70vw] h-[10vh] border-2 border-gray-400 self-center rounded-md p-2'
                onChangeText={(text) => setErrorMessage(text)}
              />
              <View
                id='BUTTONS'
                className='flex justify-between align-bottom w-[50vw]  self-center flex-row'
              >
                <Button title='Submit' onPress={handleErrorSubmit} />
                <Button
                  title='Cancel'
                  onPress={() => {
                    setIsErrorModalOpen(false);
                  }}
                />
              </View>
            </View>
          </Background>
        </Modal>
      </View>
    </Background>
  );
};

export default TaskDetailsPage;
