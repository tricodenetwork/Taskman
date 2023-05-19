import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  setMatNo,
  setDept,
  setHandler,
  setJob,
  setEmail,
  setId,
  setTasks,
} from "../store/slice-reducers/ActiveJob";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { FlatList } from "react-native-gesture-handler";
import { setVisible, setVisible2 } from "../store/slice-reducers/Formslice";
import { Motion } from "@legendapp/motion";
import { styles } from "../styles/stylesheet";
import {
  setActiveJobs,
  setJobs,
  setUsers,
} from "../store/slice-reducers/Admin";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import LowerButton from "../components/LowerButton";
import { activateJob, getJobDetails, getUserDetails } from "../api/Functions";

const jobOptions = ["Option 1", "Option 2", "Option 3"];
const handlerOptions = ["Option A", "Option B", "Option C"];

const ActivateJob = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();

  const { matNo, dept, handler, job, email, id } = useSelector(
    (state) => state.ActiveJob
  );
  const { visible, visible2 } = useSelector((state) => state.app);
  const { jobs, users } = useSelector((state) => state.Admin);
  const { ActiveJob } = useSelector((state) => state);
  const { name } = useSelector((state) => state.user);
  console.log(name);
  const handleSubmit = () => {
    // Here, you can dispatch an action to do something with the inputs
    console.log("MatNo:", matNo);
    console.log("Dept:", dept);
    console.log("Handler:", handler);
    console.log("Job:", job);
    console.log("Email:", email);
  };

  useEffect(() => {
    getJobDetails().then((res) => {
      dispatch(setJobs(res));
    });
    getUserDetails().then((res) => {
      dispatch(setUsers(res));
    });

    return () => {};
  }, []);

  const includeTasks = (Id) => {
    getJobDetails(Id).then((res) => {
      // setData(res.tasks);
      dispatch(setTasks(res.tasks));
    });
  };

  return (
    <Background>
      <Topscreen
        onPress={() => {
          navigation.goBack();
        }}
        text={"Activate Job"}
      />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View className='bg-slate-200 h-[85vh] rounded-t-3xl justify-center  p-2 w-full absolute bottom-0'>
          <View className='flex items-center justify-between h-[55vh]'>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>MatNo:</Text>
              <TextInput
                defaultValue={matNo}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setMatNo(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Job:</Text>
              <View className='w-[65vw] relative bg-slate-300  rounded-sm h-10'>
                {visible2 && (
                  <Motion.View
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={styles.box}
                    className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[65vw] flex justify-around rounded-md'
                  >
                    <FlatList
                      style={{ height: 150 }}
                      data={jobs}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            console.log(item.name);
                            dispatch(setJob(item.name));
                            includeTasks(item._id);
                            console.log(item._id);
                            dispatch(setVisible2(!visible2));
                          }}
                        >
                          <Text
                            style={styles.averageText}
                            className='border-b-[1px] border-b-slate-700'
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </Motion.View>
                )}
                <TextInput
                  defaultValue={job}
                  editable={false}
                  style={[styles.averageText, { color: "black" }]}
                  //   value={job}
                  className='w-[65vw] bg-slate-300  rounded-sm h-10'
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setVisible2(!visible2));
                }}
                className='absolute right-0'
              >
                <AntDesign name='select1' size={24} color='black' />
              </TouchableOpacity>
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Dept:</Text>
              <TextInput
                defaultValue={dept}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setDept(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Handler:</Text>
              <View className='w-[65vw] relative bg-slate-300  rounded-sm h-10'>
                {visible && (
                  <Motion.View
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={styles.box}
                    className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[65vw] flex justify-around rounded-md'
                  >
                    <FlatList
                      style={{ height: 150 }}
                      data={users}
                      renderItem={({ item }) =>
                        item.role === "Handler" && (
                          <TouchableOpacity
                            onPress={() => {
                              dispatch(setHandler(item.name));
                              dispatch(setVisible(!visible));
                            }}
                          >
                            <Text
                              style={styles.averageText}
                              className='border-b-[1px] border-b-slate-700'
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
                  defaultValue={handler}
                  editable={false}
                  style={[styles.averageText, { color: "black" }]}
                  value={handler}
                  className='w-[65vw] bg-slate-300  rounded-sm h-10'
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setVisible(!visible));
                }}
                className='absolute right-0'
              >
                <AntDesign name='select1' size={24} color='black' />
              </TouchableOpacity>
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Email:</Text>
              <TextInput
                defaultValue={email}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setEmail(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
          </View>
          <LowerButton
            disabled={
              route.params
                ? false
                : matNo === "" || dept === "" || handler === "" || job === ""
                ? true
                : false
            }
            navigate={() => {
              setIsLoading(true);

              if (route.params) {
              } else {
                activateJob(ActiveJob, name).then((res) => {
                  dispatch(setId(res.id));
                  dispatch(setActiveJobs(matNo, dept, handler, job, email, id));
                  //   console.log(res.id);
                });
              }
              setIsLoading(false);
              route.params
                ? navigation.navigate("jobs")
                : navigation.navigate("activeJobs");
              // console.log(job.id);
            }}
            text={route.params ? "Edit" : "Activate"}
          />
        </View>
      )}
    </Background>
  );
};

export default ActivateJob;
