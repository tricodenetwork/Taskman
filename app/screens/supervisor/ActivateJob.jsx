import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { Motion } from "@legendapp/motion";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  setMatNo,
  setJob,
  setEmail,
  Replace,
  setPassword,
  setSupervisor,
  setTasks,
} from "../../store/slice-reducers/ActiveJob";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import { setVisible } from "../../store/slice-reducers/Formslice";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../../styles/stylesheet";
import LowerButton from "../../components/LowerButton";
import { AccountRealmContext } from "../../models";
import { activejob, job as jobSchema } from "../../models/Task";
import { Account, client } from "../../models/Account";
import Realm from "realm";
import { generatePassword, sendClientDetails } from "../../api/Functions";

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
  const { visible } = useSelector((state) => state.app);

  const { ActiveJob } = useSelector((state) => state);
  const { category, role, name } = useSelector((state) => state.user);
  const supervisors = useQuery(Account).filtered(
    `role == "Supervisor" AND category.name ==$0`,
    category.name
  );

  const { matno, job, email, password } = useSelector(
    (state) => state.ActiveJob
  );
  const clientExist = activeJobs.filtered(
    `matno == $0 AND category == $1`,
    matno,
    ActiveJob.category
  );

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  useEffect(() => {
    if (route.params) {
      const useThis = realm.objectForPrimaryKey(
        "activejob",
        Realm.BSON.ObjectId(route.params?.id)
      );
      useThis && dispatch(Replace(useThis));
      return;
    } else {
      dispatch(Replace());
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
      sendClientDetails(item.email, item);
    },
    [realm]
  );
  const activateJob = useCallback(
    (item) => {
      if (!name || role !== "Supervisor") {
        alert("Invalid Supervisor ❌.");
        return;
      }

      if (clientExist.length !== 0) {
        alert("Client exists for this category");
        return;
      }
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
          const { tasks, timeframe } = item;
          const tasksArray = JSON.parse(JSON.stringify(tasks));
          const duration = JSON.parse(JSON.stringify(timeframe));

          const project = new activejob(realm, item);
          project.tasks = tasksArray;
          project.timeframe = duration;

          project.supervisor = name;
          alert("Job Activated ✔");
        } catch (error) {
          console.log({ error, msg: "Error writing to realm" });
        }
      });

      sendClientDetails(item.email, item);
      // sendPushNotification(pushToken);
    },
    [realm, clientExist, ActiveJob]
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
      dispatch(setEmail(value));
      setError(null);
    }
  };
  useEffect(() => {
    dispatch(setJob(allJobs[0]));

    dispatch(setTasks(allJobs[0].tasks));
  }, []);

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
                maxLength={22}
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
                  defaultValue={ActiveJob.job}
                  style={[styles.averageText, { color: "black" }]}
                  value={job}
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
                    size={actuatedNormalize(20)}
                    color='gray'
                  />
                </TouchableOpacity>
              )}
            </View>

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
                    size={actuatedNormalize(20)}
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
