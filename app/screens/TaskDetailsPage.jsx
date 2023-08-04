import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import SelectComponent from "../components/SelectComponent";
import { activejob } from "../models/Task";
import { AccountRealmContext } from "../models";
import { setCurrentTask, setHandler } from "../store/slice-reducers/ActiveJob";
import { useDispatch, useSelector } from "react-redux";
import { Account, holiday } from "../models/Account";
import ChatScreen from "./ChatScreen";
import { chats } from "../models/Chat";
import { sendPushNotification } from "../api/Functions";
import { millisecondSinceStartDate } from "../api/test";
import { Motion } from "@legendapp/motion";
import OdinaryButton from "../components/OdinaryButton";
import MultiSelect from "../components/MultiSelect";
import { setMulti } from "../store/slice-reducers/App";

const { useRealm, useQuery, useObject } = AccountRealmContext;

const TaskDetailsPage = () => {
  const [isNextTaskModalOpen, setIsNextTaskModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const { currenttask, handler } = useSelector((state) => state.ActiveJob);
  const { user } = useSelector((state) => state);
  const route = useRoute();
  const realm = useRealm();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { id, name, job, matno, supervisor, status } = route.params; // current handler for particular task
  const activeJob = useObject(activejob, Realm.BSON.ObjectId(id));
  const Accounts = useQuery(Account);
  const clients = useQuery(activejob);

  const handlers = Accounts.filter(
    (obj) =>
      (obj.role == "Handler") & (obj.category?.name == user.category.name)
  );
  const account = useQuery("account").filtered(
    `name == $0 AND role == "Handler"`,
    handler
  )[0];
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);
  const { multipleJobs } = useSelector((state) => state.App);

  const pushToken = account?.pushToken || "";

  const chatrooms = useQuery("chatroom").filtered(
    "senderId == $0 ||  recieverId == $0",
    user._id
  );

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

  // Create a chat room
  const createChatRoom = (recieverId) => {
    // Generate a unique chat room ID
    const chatRoomId = new Realm.BSON.ObjectId().toHexString();

    // Store the chat room in the Realm DB
    const chatRoom = {
      _id: chatRoomId,
      senderId: user._id,
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
        if (multipleJobs.length !== 0) {
          multipleJobs.forEach((params) => {
            clients.filtered(`matno ==$0`, params)[0].tasks.map((task) => {
              // Set task to inProgress and begin counting
              if (
                (task.name == name) &
                (task.handler == route.params.handler)
              ) {
                task.status = "InProgress";
                task.inProgress = new Date();
              }
            });
          });
        } else {
          activeJob.tasks.map((task) => {
            // Set task to inProgress and begin counting
            if ((task.name == name) & (task.handler == route.params.handler)) {
              task.status = "InProgress";
              task.inProgress = new Date();
            }
          });
        }
        alert("Task Accepted! ✔");
      } catch (error) {
        console.log({ error, msg: "Error Accepting Task" });
        alert("Error accepting message");
      }
    });
    navigation.navigate("mytasks");
  }, [
    realm,
    currenttask,
    route.params.handler,
    multipleJobs,
    clients,
    handler,
  ]);

  const handleDoneButton = () => {
    dispatch(setCurrentTask(""));
    dispatch(setHandler(""));
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
    // if (!handler) {
    //   alert("No handler selected!! ❌.");
    //   return;
    // }
    // if (!currenttask) {
    //   alert("No Task assigned ❌.");
    //   return;
    // }

    realm.write(() => {
      try {
        if (multipleJobs.length !== 0) {
          multipleJobs.forEach((params) => {
            clients.filtered(`matno ==$0`, params)[0].tasks.map((task) => {
              // on handling next task, first of all set your current task to completed
              if (task.name === name && task.handler === route.params.handler) {
                const timeCompleted = millisecondSinceStartDate(
                  task.inProgress
                );

                task.status = "Completed";
                task.completedIn = task.completedIn
                  ? new Date(timeCompleted + task.completedIn)
                  : new Date(timeCompleted);
              }

              // then set next handler...
              if (task.name == currenttask) {
                task.handler = handler;
                task.status = "Awaiting";
                sendPushNotification(pushToken, task.name);
              }
            });
          });
          alert("Task Completed! ✔ multi");
        } else {
          activeJob.tasks.map((task) => {
            // on handling next task, first of all set your current task to completed
            if (task.name === name && task.handler === route.params.handler) {
              const timeCompleted = millisecondSinceStartDate(task.inProgress);

              task.status = "Completed";
              task.completedIn = task.completedIn
                ? new Date(timeCompleted + task.completedIn)
                : new Date(timeCompleted);
            }

            // then set next handler...
            if (task.name == currenttask) {
              task.handler = handler;
              task.status = "Awaiting";
              sendPushNotification(pushToken, task.name);
            }
          });
          alert("Task Completed! ✔ single");
        }
      } catch (error) {
        console.log({ error, msg: "Error Assigning next task" });
      }
    });

    navigation.navigate("mytasks");
    // setIsNextTaskModalOpen(false);
  }, [
    realm,
    currenttask,
    multipleJobs,
    clients,
    route.params.handler,
    handler,
    name,
  ]);
  const handleErrorSubmit = () => {
    // Perform the necessary actions to send the task back to the previous handler
    // and send the error message to the supervisor
    // based on the values of nextTask and nextHandler

    if (user.role !== "Handler") {
      alert("Unauthorized Handler!! ❌.");
    }

    if (!handler) {
      alert("No handler selected!! ❌.");
    }
    if (!currenttask) {
      alert("No Task selected ❌.");
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
    errorMessage != "null" ? onSend() : null;

    realm.write(() => {
      try {
        let Error;
        activeJob.tasks.map((task) => {
          // set your recieved task to pending and not the time you've spent on the job
          if ((task.name == name) & (task.handler == route.params.handler)) {
            Error = millisecondSinceStartDate(task.inProgress);
            task.status = "Pending";
            task.inProgress = null;
            task.handler = "";
          }
        });

        activeJob.tasks.map((task) => {
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
    <Background bgColor='min-h-screen'>
      <Topscreen text={job} />
      <View className='h-[75vh] absolute bottom-0 bg-white w-full flex items-start pb-[3vh] pt-[5vh] px-[3vw] justify-between'>
        {/* Display the task details */}
        <MultiSelect
          title={"ClientJobs:"}
          setData={(params) => {
            dispatch(setMulti(params));
          }}
          data={Array.from(clients).sort(
            (a, b) => b._id.getTimestamp() - a._id.getTimestamp()
          )}
          placeholder={"Multiple"}
        />
        <Text style={[styles.text_md]}>ClientId: {matno}</Text>
        <Text style={[styles.text_md]}>Supervisor: {supervisor}</Text>
        <Text style={[styles.text_md]}>Task: {name}</Text>

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
                Press Ok to Accept
              </Text>
              <OdinaryButton
                style={"rounded-sm mt-4 bg-primary"}
                navigate={() => {
                  handleAcceptButton();

                  setVisible(!visible);
                }}
                text={"OK"}
              />
            </Motion.View>
          </TouchableOpacity>
        ) : null}
        <View
          id='BUTTONS'
          className='flex justify-around w-[80vw] self-center flex-row'
        >
          {/* Accept button */}
          <Button
            disabled={
              status == "InProgress" ||
              status == "Completed" ||
              status == "Overdue"
            }
            color={"#FF925C"}
            title='Accept'
            onPress={() => {
              setVisible(!visible);
            }}
          />
          {/* Done button */}
          <Button
            disabled={
              status == "Completed" ||
              status == "Awaiting" ||
              status == "Pending"
            }
            color={"#006400"}
            title='Done'
            onPress={handleDoneButton}
          />

          {/* Error button */}
          <Button
            disabled={status == "Completed"}
            color={"#ff4747"}
            title='Reject'
            onPress={handleErrorButton}
          />
        </View>

        {/* Next task modal */}
        <Modal visible={isNextTaskModalOpen}>
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
                  data={activeJob.tasks.filter(
                    (obj) =>
                      (obj.status == "Pending" || obj.status == "") &
                      (obj.handler == "" || obj.handler == null)
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
                <Button
                  disabled={handler == ""}
                  title='Submit'
                  onPress={() => setVisible(!visible)}
                />
                <Button
                  color={"#ff4747"}
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
            <View className=' h-[70%] pt-[5vh] flex min-h-[40vh] self-center justify-between items-center'>
              <Text
                className='self-center  text-center w-[50vw]'
                style={[
                  styles.text_sm2,
                  {
                    fontSize: actuatedNormalize(20),
                    lineHeight: actuatedNormalizeVertical(28),
                  },
                ]}
              >
                Report Error
              </Text>

              <View className='h-[70vh] flex justify-between'>
                <View className='h-[40vh] self-start px-[5vw] flex justify-between'>
                  <SelectComponent
                    title={"Task"}
                    placeholder={"Choose faulty task"}
                    data={activeJob.tasks.filter(
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
                  style={[styles.averageText]}
                  multiline={true}
                  placeholder='Error Message to Handler'
                  // value={errorMessage}
                  className='w-[70vw] h-[10vh] border-2 border-gray-400 self-center rounded-md p-2'
                  onChangeText={(text) => setErrorMessage(text)}
                />
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
                          handleErrorSubmit();
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
                  <Button title='Submit' onPress={() => setVisible(!visible)} />
                  <Button
                    title='Cancel'
                    onPress={() => {
                      setIsErrorModalOpen(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </Background>
        </Modal>
      </View>
    </Background>
  );
};

export default TaskDetailsPage;
