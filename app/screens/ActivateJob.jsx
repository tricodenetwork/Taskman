import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  setMatNo,
  setDept,
  setHandler,
  setJob,
  setEmail,
  setCurrentTask,
  Replace,
  setPassword,
  setSupervisor,
  setTasks,
} from "../store/slice-reducers/ActiveJob";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { FlatList } from "react-native-gesture-handler";
import {
  setVisible,
  setVisible2,
  setVisible3,
} from "../store/slice-reducers/Formslice";
import { Motion } from "@legendapp/motion";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import LowerButton from "../components/LowerButton";
import { AccountRealmContext } from "../models";
import { activejob, job as jobSchema } from "../models/Task";
import { Account, client } from "../models/Account";
import { useUser } from "@realm/react";
import Realm from "realm";
import {
  generatePassword,
  sendClientDetails,
  sendPushNotification,
} from "../api/Functions";
import OdinaryButton from "../components/OdinaryButton";
import { MaterialIcons } from "@expo/vector-icons";

const { useRealm, useQuery, useObject } = AccountRealmContext;

const ActivateJob = ({ navigation }) => {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [error, setError] = useState(null);

  const route = useRoute();
  const realm = useRealm();
  const activeJobs = useQuery(activejob);
  const allJobs = useQuery(jobSchema);
  const { visible, visible3 } = useSelector((state) => state.app);
  const accounts = useQuery(client);

  const { ActiveJob } = useSelector((state) => state);
  const { category, role, name } = useSelector((state) => state.user);
  const supervisors = useQuery(Account).filtered(
    `role == "Supervisor" AND category.name ==$0`,
    category.name
  );

  const pushToken =
    useQuery("account").filtered(`name == $0 AND role == "Handler"`, handler)[0]
      ?.pushToken ?? "";

  const { matno, dept, handler, job, email, currenttask, password, id } =
    useSelector((state) => state.ActiveJob);
  const clientExist = useQuery("client").filtered(`clientId == $0`, matno);

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  useEffect(() => {
    if (route.params) {
      const useThis = realm.objectForPrimaryKey(
        "activejob",
        Realm.BSON.ObjectId(route.params?.id)
      );
      const currentActiveJob = {
        matno: useThis.matno,
        supervisor: useThis.supervisor,
        email: useThis.email,
        job: { name: useThis.job.name },
      };
      useThis && dispatch(Replace(useThis));
    } else {
      dispatch(Replace());
      return;
    }
  }, [route.params]);

  const EditActiveJob = useCallback(
    (item) => {
      realm.write(() => {
        try {
          const project = realm.objectForPrimaryKey(
            "activejob",
            Realm.BSON.ObjectId(route.params.id)
          );
          project.matno = item.matno;
          project.email = item.email;
          project.supervisor = item.supervisor;
          alert("Activejob edited successfully!");
        } catch (error) {
          console.log({ error, msg: "Error writing to realm" });
        }
      });
    },
    [realm]
  );
  const activateJob = useCallback(
    (item) => {
      if (!name || role !== "Supervisor") {
        alert("Invalid Supervisor ❌.");
        return;
      }

      // console.log(clientExist);
      // if (clientExist.length !== 0) {
      //   alert("Client Exists already");
      //   return;
      // }
      realm.write(() => {
        const user = {
          email: item.email,
          clientId: item.matno,
          password: item.password,
        };
        return new client(realm, user);
      });

      realm.write(() => {
        try {
          const { tasks, ...rest } = item;
          const tasksArray = JSON.parse(JSON.stringify(tasks));
          // const Item = JSON.parse(JSON.stringify(item));

          const project = new activejob(realm, item);
          project.tasks = tasksArray;

          // project.tasks.map((task) => {
          //   if (task.name == item.currenttask) {
          //     task.handler = item.handler;
          //   }
          // });
          project.supervisor = name;
          alert("Job Activated ✔");
        } catch (error) {
          console.log({ error, msg: "Error writing to realm" });
        }
      });

      sendClientDetails(item.email, item);
      sendPushNotification(pushToken);
    },
    [realm]
  );
  const deleteActiveJob = useCallback(() => {
    realm.write(() => {
      realm.delete(
        realm.objectForPrimaryKey(
          "activejob",
          Realm.BSON.ObjectId(route.params.id)
        )
      );
    });
  });
  const validateEmail = (email) => {
    // Regular expression to check if email is valid
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailChange = (value) => {
    if (!validateEmail(value)) {
      setError("Please enter a valid email");
    } else {
      if (accounts.filtered(`email ==$0`, value).length !== 0) {
        setError("Email already exist");
      } else {
        dispatch(setEmail(value));
        setError(null);
      }
    }
  };

  //----------------------------------------------------RENDERED COMPONENT

  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen
        del={deleteActiveJob}
        text={route.params ? "Edit Job" : "Activate Job"}
      />
      {isLoading ? (
        <View className='items-center justify-center h-[58vh] border-2'>
          <Text style={styles.text_md2}>Loading...</Text>
          <ActivityIndicator size={"large"} color={"#004343"} />
        </View>
      ) : (
        <View
          id='FULL_VIEW'
          className='bg-slate-200 h-[80vh] rounded-t-3xl justify-center  p-2 w-full absolute bottom-0'
        >
          <View className='flex items-center justify-between h-[55vh]'>
            <View
              id='MAT_NO'
              className='flex items-center justify-between w-[90%] flex-row'
            >
              <Text style={[styles.Pcard]}>ClientID:</Text>
              <TextInput
                defaultValue={matno}
                style={styles.averageText}
                maxLength={10}
                onChangeText={(value) => {
                  dispatch(setMatNo(value));
                }}
                className='w-[60vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View
              id='JOB'
              className='flex items-center justify-between w-[90%] flex-row'
            >
              <Text style={[styles.Pcard]}>Job:</Text>
              <View className='w-[60vw] relative bg-slate-300  rounded-sm h-10'>
                {visible2 ? (
                  <View
                    style={styles.box}
                    className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[60vw] flex justify-around rounded-md'
                  >
                    <FlatList
                      style={{ height: 200 }}
                      data={allJobs}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            const jobObject = {
                              _id: new Realm.BSON.ObjectId(),
                              name: item.name,
                              category: item.category,
                              tasks: item.tasks,
                            };

                            dispatch(setJob(item));
                            dispatch(setTasks(item.tasks));

                            setVisible2(!visible2);
                          }}
                        >
                          <Text
                            style={styles.averageText}
                            className='border-b-[1px] my-[1vh] border-b-slate-700'
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                ) : null}
                <TextInput
                  defaultValue={ActiveJob.job ?? ""}
                  editable={false}
                  style={[styles.averageText, { color: "black" }]}
                  value={job ?? ""}
                  className='w-[60vw] bg-slate-300  rounded-sm h-10'
                />
              </View>
              {route.params?.id ? null : (
                <TouchableOpacity
                  onPress={() => {
                    setVisible2(!visible2);
                  }}
                  className='absolute right-[1vw]'
                >
                  <AntDesign
                    name='caretdown'
                    size={actuatedNormalize(18)}
                    color='gray'
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* <View
              id='TASK'
              className='flex items-center justify-between w-[90%] flex-row'
            >
              <Text style={[styles.Pcard]}>Task:</Text>
              <View className='w-[60vw] relative bg-slate-300  rounded-sm h-10'>
                {visible3 && (
                  <Motion.View
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={styles.box}
                    className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[60vw] flex justify-around rounded-md'
                  >
                    <FlatList
                      style={{ height: 200 }}
                      data={ActiveJob.job?.tasks ?? []}
                      // data={[]}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(setCurrentTask(item.name));
                            dispatch(setVisible3());
                          }}
                        >
                          <Text
                            style={styles.averageText}
                            className='border-b-[1px] my-[1vh] border-b-slate-700'
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </Motion.View>
                )}
                <TextInput
                  // defaultValue={ActiveJob.job.tasks[0]?.name ?? ""}
                  defaultValue={
                    ActiveJob.job?.tasks && ActiveJob.job?.tasks.length > 0
                      ? ActiveJob.job?.tasks[0].name
                      : ""
                  }
                  editable={false}
                  multiline={true}
                  style={[styles.averageText, { color: "black" }]}
                  value={ActiveJob.currenttask}
                  className='w-[56vw] bg-slate-300  rounded-sm h-10'
                />
              </View>
              {route.params?.id ? null : (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setVisible3());
                  }}
                  className='absolute right-[1vw]'
                >
                  <AntDesign
                    name='caretdown'
                    size={actuatedNormalize(18)}
                    color='gray'
                  />
                </TouchableOpacity>
              )}
            </View> */}
            {route.params?.id ? (
              <View
                id='SUPERVISOR'
                className='flex items-center justify-between w-[90%] flex-row'
              >
                <Text style={[styles.Pcard]}>Supervisor:</Text>
                <View className='w-[60vw] relative bg-slate-300  rounded-sm h-10'>
                  {visible && (
                    <Motion.View
                      initial={{ x: 100 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.2 }}
                      style={styles.box}
                      className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[60vw] flex justify-around rounded-md'
                    >
                      <FlatList
                        style={{ height: 200 }}
                        data={supervisors}
                        renderItem={({ item }) =>
                          item.category.name === category.name && (
                            <TouchableOpacity
                              onPress={() => {
                                dispatch(setSupervisor(item.name));
                                dispatch(setVisible());
                              }}
                            >
                              <Text
                                style={styles.averageText}
                                className='border-b-[1px] my-[1vh] border-b-slate-700'
                              >
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          )
                        }
                      />
                    </Motion.View>
                  )}
                  <TextInput
                    // defaultValue={ActiveJob.job.tasks[0]?.handler ?? ""}
                    defaultValue={ActiveJob.supervisor ?? ""}
                    editable={false}
                    style={[styles.averageText, { color: "black" }]}
                    value={ActiveJob.supervisor ?? ""}
                    className='w-[60vw] bg-slate-300  rounded-sm h-10'
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    dispatch(setVisible());
                  }}
                  className='absolute right-[1vw]'
                >
                  <AntDesign
                    name='caretdown'
                    size={actuatedNormalize(18)}
                    color='gray'
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            <View
              id='EMAIL'
              className='flex items-center justify-between w-[90%] flex-row'
            >
              <Text style={[styles.Pcard]}>Email:</Text>
              <TextInput
                defaultValue={email}
                style={styles.averageText}
                onChangeText={(value) => {
                  handleEmailChange(value);
                }}
                className='w-[60vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View className='flex  items-end relative left-[23vw] justify-center'>
              <TouchableOpacity
                onPress={() => {
                  const pass = generatePassword(10);
                  dispatch(setPassword(pass));
                }}
                className='bg-Supervisor2 p-2 rounded-md'
              >
                <Text style={styles.text_md}>Generate Password</Text>
              </TouchableOpacity>
              <TextInput
                editable={false}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
                secureTextEntry={false}
                value={ActiveJob.password}
                className='w-[30vw] bg-slate-300 mt-2 text-black  rounded-sm'
              />
            </View>
          </View>
          {error && (
            <Motion.View
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='absolute flex-row items-center space-x-1 px-[1vh] self-center top-[1vh] '
            >
              <Text style={[styles.text_sm, { color: "red" }]}>{error}</Text>
              <MaterialIcons
                name='error'
                size={actuatedNormalize(18)}
                color='red'
              />
            </Motion.View>
          )}
          <LowerButton
            disabled={
              route.params
                ? false
                : matno === "" ||
                  job === "" ||
                  email === "" ||
                  password == "" ||
                  error
                ? //  || currenttask == ""
                  true
                : false
            }
            navigate={() => {
              setIsLoading(true);

              if (route.params) {
                EditActiveJob(ActiveJob);
              } else {
                activateJob(ActiveJob);
              }
              setIsLoading(false);

              navigation.navigate("activeJobs");
            }}
            text={route.params ? "Edit" : "Activate"}
            style={"w-[90vw]"}
          />
        </View>
      )}
    </Background>
  );
};

export default ActivateJob;
