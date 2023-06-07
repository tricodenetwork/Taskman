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
  setId,
  setTasks,
  setCurrentTask,
  Replace,
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
import { actuatedNormalize, styles } from "../styles/stylesheet";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import LowerButton from "../components/LowerButton";
import { AccountRealmContext } from "../models";
import { activejob, job as jobSchema } from "../models/Task";
import { Account, client } from "../models/Account";
import { useUser } from "@realm/react";
import Realm from "realm";
import { sendClientDetails, sendPushNotification } from "../api/Functions";
import OdinaryButton from "../components/OdinaryButton";

const { useRealm, useQuery, useObject } = AccountRealmContext;

const ActivateJob = ({ navigation }) => {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const realm = useRealm();
  const user = useUser();
  const activeJobs = useQuery(activejob);
  const allJobs = useQuery(jobSchema);
  const handlers = useQuery(Account).filtered(`role == "Handler"`);
  const { visible, visible2, visible3 } = useSelector((state) => state.app);
  const { ActiveJob } = useSelector((state) => state);
  const { category } = useSelector((state) => state.user);
  const oid = user.identities[0].id;
  const cleanedOid = oid.replace(/[^0-9a-fA-F]/g, "");
  const supervisor = realm.objectForPrimaryKey(
    "account",
    Realm.BSON.ObjectId(cleanedOid)
  ).name;
  const pushToken =
    useQuery("account").filtered(`name == $0 AND role == "Handler"`, handler)[0]
      ?.pushToken ?? "";

  const { matNo, dept, handler, job, email, currenttask, id } = useSelector(
    (state) => state.ActiveJob
  );
  const clientExist = useObject("client", matNo);

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  useEffect(() => {
    if (route.params) {
      const useThis = realm.objectForPrimaryKey(
        "activejob",
        Realm.BSON.ObjectId(route.params?.id)
      );
      useThis && dispatch(Replace(useThis));
    } else {
      dispatch(Replace());
      return;
    }
  }, [route.params]);

  const EditActiveJob = useCallback(
    (item) => {
      // console.log(item);
      realm.write(() => {
        try {
          const project = realm.objectForPrimaryKey(
            "activejob",
            Realm.BSON.ObjectId(route.params.id)
          );

          project.job = item.job;
          project.dept = item.dept;
          project.matNo = item.matNo;
          project.email = item.email;

          project.job.tasks.map((task) => {
            const { name, handler } = task;

            if (name == item.currenttask) {
              task.handler = item.handler;
              alert("Activejob edited successfully!");

              return;
            }
          });

          console.log("Edited successully!");
        } catch (error) {
          console.log({ error, msg: "Error writing to realm" });
        }
      });
    },
    [realm]
  );
  const activateJob = useCallback(
    (item) => {
      if (!supervisor) {
        alert("No supervisor");
        return;
      }

      if (clientExist) {
        alert("Client Exists already");
        return;
      } else {
        realm.write(() => {
          const user = { email: item.email, _id: item.matNo };
          return new client(realm, user);
        });
      }

      realm.write(() => {
        try {
          const { tasks, ...rest } = item;
          // const tasksArray = JSON.parse(JSON.stringify(tasks));
          // const Item = JSON.parse(JSON.stringify(item));

          const project = new activejob(realm, item);
          // project.job.tasks = tasksArray;

          project.job.tasks.map((task) => {
            const { name, handler } = task;
            if (name == item.currenttask) {
              task.handler = item.handler;
            }
          });
          // project.tasks[0].handler = item.handler;
          project.supervisor = supervisor;
          alert("Job Activated");
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
          <OdinaryButton
            text={"Send"}
            navigate={() => {
              sendClientDetails(ActiveJob.email, ActiveJob);
            }}
            style={"bg-Handler3 absolute top-[5vh] right-[5vw]"}
          />
          <View className='flex items-center justify-between h-[55vh]'>
            <View
              id='MAT_NO'
              className='flex items-center justify-between w-[90%] flex-row'
            >
              <Text style={[styles.Pcard]}>ClientID:</Text>
              <TextInput
                defaultValue={matNo}
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
                {visible2 && (
                  <Motion.View
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={styles.box}
                    className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[60vw] flex justify-around rounded-md'
                  >
                    <FlatList
                      style={{ height: 200 }}
                      data={allJobs}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            // console.log(item.name);
                            dispatch(setJob(item));
                            // dispatch(setTasks(item.tasks));

                            // console.log(item.tasks);
                            dispatch(setVisible2());
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
                  defaultValue={ActiveJob.job.name ?? ""}
                  editable={false}
                  style={[styles.averageText, { color: "black" }]}
                  value={job.name ?? ""}
                  className='w-[60vw] bg-slate-300  rounded-sm h-10'
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setVisible2());
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
            <View
              id='DEPT'
              className='flex items-center justify-between w-[90%] flex-row'
            >
              <Text style={[styles.Pcard]}>Dept:</Text>
              <TextInput
                defaultValue={dept}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setDept(value));
                }}
                className='w-[60vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View
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
                      data={ActiveJob.job.tasks ?? []}
                      // data={[]}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(setCurrentTask(item.name));
                            dispatch(setVisible3());
                            console.log(ActiveJob.currenttask);
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
                    ActiveJob.job.tasks && ActiveJob.job.tasks.length > 0
                      ? ActiveJob.job.tasks[0].name
                      : ""
                  }
                  editable={false}
                  multiline={true}
                  style={[styles.averageText, { color: "black" }]}
                  value={ActiveJob.currenttask}
                  className='w-[56vw] bg-slate-300  rounded-sm h-10'
                />
              </View>
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
            </View>
            <View
              id='HANDLER'
              className='flex items-center justify-between w-[90%] flex-row'
            >
              <Text style={[styles.Pcard]}>Handler:</Text>
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
                      data={handlers}
                      renderItem={({ item }) =>
                        item.category === category && (
                          <TouchableOpacity
                            onPress={() => {
                              dispatch(setHandler(item.name));
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
                  defaultValue={
                    ActiveJob.job.tasks && ActiveJob.job.tasks.length > 0
                      ? ActiveJob.job.tasks[0].handler
                      : ""
                  }
                  editable={false}
                  style={[styles.averageText, { color: "black" }]}
                  value={handler}
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
            <View
              id='EMAIL'
              className='flex items-center justify-between w-[90%] flex-row'
            >
              <Text style={[styles.Pcard]}>Email:</Text>
              <TextInput
                defaultValue={email}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setEmail(value));
                }}
                className='w-[60vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
          </View>
          <LowerButton
            disabled={
              route.params
                ? false
                : matNo === "" ||
                  dept === "" ||
                  handler === "" ||
                  job === "" ||
                  email === "" ||
                  currenttask == ""
                ? true
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
          />
        </View>
      )}
    </Background>
  );
};

export default ActivateJob;
  