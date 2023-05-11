import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { styles } from "../styles/stylesheet";
import LowerButton from "../components/LowerButton";
import {
  editJob,
  generatePassword,
  sendJobDetails,
  sendUserDetails,
} from "../api/Functions";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setVisible } from "../store/slice-reducers/Formslice";
import { Motion } from "@legendapp/motion";
import {
  setName,
  setDuration,
  setNo,
  setCategory,
  setId,
} from "../store/slice-reducers/JobSlice";
import { Modal } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function CreateJob({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();
  const { visible } = useSelector((state) => state.app);
  const { job } = useSelector((state) => state);
  const { id, name, category, no, duration } = job;
  const { jobId, name2, category2, no2, duration2 } = route.params;

  console.log(jobId, name, category, no, duration);

  const updateInitials = () => {
    if (route.params) {
      dispatch(setId(jobId));
      dispatch(setName(name2));
      dispatch(setCategory(category2));
      dispatch(setNo(no2));
      dispatch(setDuration(duration2));
    } else {
      return;
    }
  };

  useEffect(() => {
    updateInitials();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Background>
      <Topscreen
        onPress={() => {
          navigation.goBack();
        }}
        text={"Create Job"}
      />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View className='bg-slate-200 h-[85vh] rounded-t-3xl justify-center  p-2 w-full absolute bottom-0'>
          <View className='flex items-center justify-between h-[55vh]'>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Name:</Text>
              <TextInput
                defaultValue={name}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setName(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Category:</Text>
              <View className='w-[65vw] relative bg-slate-300  rounded-sm h-10'>
                {visible && (
                  <Motion.View
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={styles.box}
                    className='bg-white absolute bottom-0 right-0  space-y-1  border-2 border-black w-[65vw] flex justify-around rounded-md'
                  >
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setCategory("Easy"));
                        dispatch(setVisible(!visible));
                      }}
                    >
                      <Text
                        style={styles.averageText}
                        className='border-b-[1px] border-b-slate-700'
                      >
                        Easy
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setCategory("Medium"));
                        dispatch(setVisible(!visible));
                      }}
                    >
                      <Text
                        style={styles.averageText}
                        className='border-b-[1px] border-b-slate-700'
                      >
                        Medium
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setCategory("Hard"));
                        dispatch(setVisible(!visible));
                      }}
                    >
                      <Text
                        style={styles.averageText}
                        className='border-b-[1px] border-b-slate-700'
                      >
                        Hard
                      </Text>
                    </TouchableOpacity>
                  </Motion.View>
                )}
                <TextInput
                  defaultValue={category}
                  editable={false}
                  style={[styles.averageText, { color: "black" }]}
                  value={job.category}
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
              <Text style={styles.text}>No:</Text>
              <TextInput
                defaultValue={no.toString()}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setNo(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Duration:</Text>
              <TextInput
                defaultValue={duration}
                style={styles.averageText}
                onChangeText={(value) => {
                  dispatch(setDuration(value));
                }}
                className='w-[65vw] bg-slate-300  rounded-sm h-10'
              />
            </View>
          </View>
          <LowerButton
            disabled={
              route.params
                ? false
                : name === "" || category === "" || no === "" || duration === ""
                ? true
                : false
            }
            navigate={() => {
              setIsLoading(true);

              if (route.params) {
                editJob(job).then((res) => {
                  console.log(res);
                });
              } else {
                sendJobDetails(job).then((res) => {
                  dispatch(setId(res));
                  console.log(res);
                });
              }
              setIsLoading(false);
              route.params
                ? navigation.navigate("jobs")
                : navigation.navigate("jobs");
              //   console.log(job.id);
            }}
            text={route.params ? "Edit" : "Create"}
          />
        </View>
      )}
    </Background>
  );
}
