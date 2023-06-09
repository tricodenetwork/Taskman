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
import ChatScreen from "./ChatScreen";
import { chats } from "../models/Chat";
import { sendPushNotification } from "../api/Functions";
import { millisecondSinceStartDate } from "../api/test";

const { useRealm, useQuery, useObject } = AccountRealmContext;

const TaskDetailsPage = () => {
  const [isNextTaskModalOpen, setIsNextTaskModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const { user } = useSelector((state) => state);
  const route = useRoute();
  const realm = useRealm();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { id, name, job, matNo, supervisor, status } = route.params; // current handler for particular task
  const activeJob = useObject(activejob, Realm.BSON.ObjectId(id));
  const Accounts = useQuery(Account);
  const handlers = Accounts.filter(
    (obj) =>
      (obj.role == "Handler") & (obj.category?.name == user.category.name)
  );
  const account = useQuery("account").filtered(
    `name == $0 AND role == "Handler"`,
    handler
  )[0];
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);

  const pushToken = account?.pushToken || "";

  const chatrooms = useQuery("chatroom").filtered(
    "senderId == $0 ||  recieverId == $0",
    id
  );

  // Create a chat room
  const createChatRoom = (recieverId) => {
    // Generate a unique chat room ID
    const chatRoomId = new Realm.BSON.ObjectId().toHexString();

    // Store the chat room in the Realm DB
    const chatRoom = {
      _id: chatRoomId,
      senderId: id,
      recieverId,
      // Additional properties if needed
    };

    const roomId = chatrooms.filtered(
      `senderId == $0 AND recieverId ==$1`,
      user._id,
      recieverId
    );
    // Check if chatroom exist and create one if not
    if (roomId.length == 0) {
      // Create a new chat room object in the Realm DB
      realm.write(() => {
        realm.create("chatroom", chatRoom);
      });
      // Return the created chat room ID

      return chatRoomId;
    } else {
      return roomId[0]._id;
    }
  };

  const handleAcceptButton = useCallback(() => {
    // Perform the necessary actions to accept task
    // based on the values of nextTask and nextHandler

    if (user.role !== "Handler") {
      alert("Unauthorized Handler!! ❌.");
    }

    realm.write(() => {
      try {
        activeJob.job.tasks.map((task) => {
          // Set task to inProgress and begin counting
          if ((task.name == name) & (task.handler == route.params.handler)) {
            task.status = "InProgress";
            task.inProgress = new Date();
          }
        });
        alert("Task Accepted! ✔");
      } catch (error) {
        console.log({ error, msg: "Error Accepting Task" });
        alert("Error accepting message");
      }
    });

    // calculateInterval(taskInfo.duration);

    // navigation.navigate("mytasks");
    // setIsNextTaskModalOpen(false);
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

    if (user.role !== "Handler") {
      alert("Unauthorized Handler!! ❌.");
    }

    realm.write(() => {
      try {
        activeJob.job.tasks.map((task) => {
          // on handling next task, first of all set your current task to completed
          if ((task.name == name) & (task.handler == route.params.handler)) {
            const timeCompleted = millisecondSinceStartDate(task.inProgress);

            task.status = "Completed";
            task.completedIn = task.completedIn
              ? new Date(timeCompleted + task.completedIn)
              : new Date(timeCompleted);
          }

          // then set next handler...
          if (task.name == currenttask) {
            task.handler = handler;
          }
        });
        alert("Task Completed! ✔");
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });

    sendPushNotification(pushToken);

    // navigation.navigate("mytasks");
    // setIsNextTaskModalOpen(false);
  }, [realm, currenttask, handler]);
  const handleErrorSubmit = () => {
    // Perform the necessary actions to send the task back to the previous handler
    // and send the error message to the supervisor
    // based on the values of nextTask and nextHandler

    if (user.role !== "Handler") {
      alert("Unauthorized Handler!! ❌.");
    }

    //select handler Id to send error

    receiverId = Accounts.filtered(
      `role == "Handler" AND name == $0`,
      handler
    )[0]._id;
    const roomId = createChatRoom(receiverId.toHexString());

    const onSend = () => {
      const messageObject = {
        _id: new Realm.BSON.ObjectId().toHexString(),
        text: errorMessage,
        createdAt: new Date(),
        user: { _id: user._id, name: user.name },
        roomId: roomId,
      };

      realm.write(() => {
        return new chats(realm, messageObject);
      });
    };
    errorMessage != "null" && onSend();

    realm.write(() => {
      try {
        let Error;
        activeJob.job.tasks.map((task) => {
          // set your recieved task to pending and not the time you've spent on the job
          if ((task.name == name) & (task.handler == route.params.handler)) {
            Error = millisecondSinceStartDate(task.inProgress);
            task.status = "Pending";
            task.inProgress = null;
            task.handler = "";
          }
          if (task.name == currenttask) {
            task.status = "Pending";
            task.inProgress = null;
            task.handler = handler;
            task.error = Error;
          }
        });

        alert("Task rejected! 🚫");
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });

    sendPushNotification(pushToken, "Error in Task");
    navigation.navigate("mytasks");

    setIsErrorModalOpen(false);
  };

  return (
    <Background>
      <Topscreen text={job} />
      <View className='h-[75vh] absolute bottom-0 bg-white w-full flex items-start pb-[3vh] pt-[5vh] px-[3vw] justify-between'>
        {/* Display the task details */}
        <Text style={[styles.text_md]}>Id: {id.toString()}</Text>
        <Text style={[styles.text_md]}>ClientId: {matNo}</Text>
        <Text style={[styles.text_md]}>Supervisor: {supervisor}</Text>
        <Text style={[styles.text_md]}>Task: {name}</Text>
        {/* <Text style={[styles.text_md]}>Job: {taskInfo.job}</Text> */}
        {/* <Text style={[styles.text_sm2]}>Timer:{time}</Text> */}

        <View
          id='BUTTONS'
          className='flex justify-around w-[80vw] self-center flex-row'
        >
          {/* Accept button */}
          <Button
            disabled={
              status !== "InProgress" ||
              status == "Completed" ||
              isWeekend ||
              !isAllowedTime
                ? true
                : false
            }
            color={"#00a3a3"}
            title='Accept'
            onPress={handleAcceptButton}
          />
          {/* Done button */}
          <Button
            disabled={
              (status == "Completed" || isWeekend || !isAllowedTime) && true
            }
            color={"#004343"}
            title='Done'
            onPress={handleDoneButton}
          />

          {/* Error button */}
          <Button
            disabled={
              (status == "Completed" || isWeekend || !isAllowedTime) && true
            }
            color={"#E59F71"}
            title='Reject'
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
                  data={activeJob.job.tasks.filter(
                    (obj) => obj.status == "Pending" || obj.status == ""
                  )}
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
            <View className=' h-[70%] pt-[5vh] flex self-center justify-between items-center'>
              <Text
                className='self-center  text-center w-[50vw]'
                style={[styles.text_sm2, { fontSize: actuatedNormalize(20) }]}
              >
                Report Error
              </Text>

              <View className='h-[30vh] self-start px-[5vw] flex justify-around'>
                <SelectComponent
                  title={"Task"}
                  placeholder={"Choose faulty task"}
                  data={activeJob.job.tasks.filter(
                    (obj) => obj.status == "Completed"
                  )}
                  setData={(params) => {
                    dispatch(setCurrentTask(params));
                  }}
                />
                <SelectComponent
                  title={"Handler"}
                  placeholder={"Send to Handler"}
                  data={handlers}
                  setData={(params) => {
                    dispatch(setHandler(params));
                  }}
                />
              </View>
              <TextInput
                multiline={true}
                placeholder='Error Message to Handler'
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
