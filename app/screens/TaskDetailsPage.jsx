import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { AccountRealmContext } from "../models";
import {
  setCurrentTask,
  setHandler,
  setPassword,
} from "../store/slice-reducers/ActiveJob";
import { useDispatch, useSelector } from "react-redux";
import { chats } from "../models/Chat";
import { sendPushNotification } from "../api/Functions";
import { millisecondSinceStartDate } from "../api/test";
import { Motion } from "@legendapp/motion";
import OdinaryButton from "../components/OdinaryButton";
import MultiSelect from "../components/MultiSelect";
import { setMulti } from "../store/slice-reducers/App";
import useRealmData from "../hooks/useRealmData";
import useActions from "../hooks/useActions";

const { useRealm } = AccountRealmContext;

const TaskDetailsPage = () => {
  const [isNextTaskModalOpen, setIsNextTaskModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const { isWeekend, isAllowedTime } = useSelector((state) => state.app);

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

  const {
    activeJob,
    Accounts,
    ActiveJobs,
    tasks,
    handlers,
    pushToken,
    uniqueTasks,
  } = useRealmData(route.params);

  // Create a chat room
  const { createChatRoom } = useActions();

  const filterMultipleJobs = (ActiveJobs, param) => {
    return ActiveJobs.filtered(`matno ==$0`, param)[0]?.tasks;
  };

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
            filterMultipleJobs(ActiveJobs, params).map((task) => {
              // Set task to inProgress and begin counting
              if ((task.name == password) & (task.handler == user.name)) {
                task.status = "InProgress";
                task.inProgress = new Date();
              }
            });
          });
        } else {
          activeJob?.tasks.map((task) => {
            // Set task to inProgress and begin counting
            if (
              (task.name == route.params?.name) &
              (task.handler == route.params.handler)
            ) {
              task.status = "InProgress";
              task.inProgress = new Date();
            }
          });
        }
        alert("Task Accepted! ✔");
        update([]);
      } catch (error) {
        console.log({ error, msg: "Error Accepting Task" });
        alert("Error accepting message");
      }
    });
    dispatch(setCurrentTask(""));
    dispatch(setHandler(""));
    navigation.navigate("mytasks");
  }, [
    realm,
    currenttask,
    route.params?.handler,
    multipleJobs,
    ActiveJobs,
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
    dispatch(setCurrentTask(""));
    dispatch(setHandler(""));
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
    route.name,
    password,
  ]);
  const handleErrorSubmit = useCallback(() => {
    // Perform the necessary actions to send the task back to the previous handler
    // and send the error message to the supervisor
    // based on the values of nextTask and nextHandler

    if (user.role !== "Handler") {
      alert("Unauthorized Handler!! ❌.");
    }

    if (!handler) {
      alert("No handler selected!! ❌.");
      return;
    }
    if (!currenttask) {
      alert("No Task selected ❌.");
      return;
    }

    //select handler Id to send error

    receiverId = Accounts.filtered(
      `role == "Handler" AND name == $0`,
      handler
    )[0]?._id;
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
        activeJob?.tasks.map((task) => {
          // set your recieved task to pending and not the time you've spent on the route.params?.job
          if (
            (task.name == route.params?.name) &
            (task.handler == route.params?.handler)
          ) {
            task.handler = "";
            Error = millisecondSinceStartDate(task.inProgress);
            task.status = "Pending";
            task.inProgress = null;
          }
        });

        activeJob?.tasks.map((task) => {
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
    dispatch(setCurrentTask(""));
    dispatch(setHandler(""));
    sendPushNotification(pushToken, "Error in Task");
    update([]);
    navigation.navigate("mytasks");

    setIsErrorModalOpen(false);
  }, [
    realm,
    currenttask,
    multipleJobs,
    ActiveJobs,
    route.params?.handler,
    handler,
    route.params?.name,
  ]);
  return (
    <Background bgColor='min-h-screen bg-white'>
      <Topscreen text={route.params?.job} />
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
        {route.params ? (
          <Text style={[styles.text_md]}>ClientId: {route.params?.matno}</Text>
        ) : null}
        {route.params ? (
          <Text style={[styles.text_md]}>
            Supervisor: {route.params?.supervisor}
          </Text>
        ) : null}
        {route.params ? (
          <Text style={[styles.text_md]}>Task: {route.params?.name}</Text>
        ) : null}

        <View
          id='BUTTONS'
          className='flex justify-around w-[80vw] self-center flex-row'
        >
          {/* Accept button */}
          <Button
            disabled={
              route.params?.status == "InProgress" ||
              route.params?.status == "Completed" ||
              route.params?.status == "Overdue" ||
              isWeekend ||
              !isAllowedTime ||
              (route.params == undefined && multipleJobs.length == 0) ||
              (route.params == undefined && password == "")
            }
            color={"#FF925C"}
            title='Accept'
            onPress={() => {
              handleAcceptButton();
            }}
          />
          {/* Done button */}
          <Button
            disabled={
              route.params?.status == "Completed" ||
              route.params?.status == "Awaiting" ||
              route.params?.status == "Pending" ||
              isWeekend ||
              !isAllowedTime ||
              (route.params == undefined && multipleJobs.length == 0) ||
              (route.params == undefined && password == "")
            }
            color={"#006400"}
            title='Done'
            onPress={handleDoneButton}
          />

          {/* Error button */}
          {route.params !== undefined && (
            <Button
              disabled={route.params?.status == "Completed"}
              color={"#ff4747"}
              title='Reject'
              onPress={handleErrorButton}
            />
          )}
        </View>

        {/* Next task modal */}
        <Modal visible={isNextTaskModalOpen}>
          {isNextTaskModalOpen && (
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
                  <Button
                    disabled={handler == "" || currenttask == ""}
                    title='Assign'
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
          )}
        </Modal>

        {/* Error modal */}
        <Modal visible={isErrorModalOpen}>
          {isErrorModalOpen && (
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
                      data={activeJob?.tasks.filter(
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
                        <Text
                          style={styles.text_sm}
                          className='text-center mb-2'
                        >
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
                    <Button
                      title='Submit'
                      onPress={() => setVisible(!visible)}
                    />
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
          )}
        </Modal>
      </View>
    </Background>
  );
};

export default TaskDetailsPage;
