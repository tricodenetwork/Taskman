import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { actuatedNormalizeVertical, styles } from "../styles/stylesheet";
import LowerButton from "../components/LowerButton";

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
import { job } from "../models/Task";
import { AccountRealmContext } from "../models";

const { useRealm, useQuery } = AccountRealmContext;

export default function CreateJob({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const route = useRoute();
  const realm = useRealm();
  const { visible } = useSelector((state) => state.app);
  const { Job } = useSelector((state) => state);
  const { id, name, category, no, duration } = Job;
  // const { jobId, name2, category2, no2, duration2 } = route.params;

  // console.log(jobId, name, category, no, duration);
  const job = realm?.objectForPrimaryKey("job", route.params?.id);

  const updateInitials = () => {
    if (route.params) {
      dispatch(setName(job.name));
      dispatch(setCategory(job.category));
      dispatch(setDuration(job.duration));
    } else {
      return;
    }
  };

  useEffect(() => {
    updateInitials();
  }, []);

  const editJob = useCallback(
    (item) => {
      // Alternatively if passing the ID as the argument to handleToggleTaskStatus:
      realm?.write(() => {
        const job = realm?.objectForPrimaryKey("job", route.params?.id); // If the ID is passed as an ObjectId
        // const task = realm?.objectForPrimaryKey('Task', Realm.BSON.ObjectId(id));  // If the ID is passed as a string
        job.name = item.name;
        job.category = item.category;
        job.duration = item.duration;
      });
    },
    [realm]
  );

  const createJob = useCallback(
    (item) => {
      if (!item) {
        return;
      }
      realm.write(() => {
        return new job(realm, item);
      });
    },
    [realm]
  );

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
        <View className='bg-slate-200 h-[85vh] rounded-t-3xl justify-center   w-full absolute bottom-0'>
          <View className='flex items-center justify-between h-[55vh]'>
            <View className='flex items-center justify-between w-[90%] flex-row'>
              <Text style={styles.text}>Name:</Text>
              <TextInput
                defaultValue={name}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
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
                  style={[
                    styles.averageText,
                    { color: "black", height: actuatedNormalizeVertical(50) },
                  ]}
                  value={Job.category}
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
              <Text style={styles.text}>Duration:</Text>
              <TextInput
                keyboardType='numeric'
                defaultValue={duration}
                style={[
                  styles.averageText,
                  { height: actuatedNormalizeVertical(50) },
                ]}
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
                : name === "" || category === ""
                ? true
                : false
            }
            navigate={() => {
              setIsLoading(true);

              if (route.params) {
                editJob(Job);
                navigation.navigate("jobs");
              } else {
                createJob({ name: name, category: category });
                navigation.navigate("jobs");
              }
              setIsLoading(false);

              //   console.log(job.id);
            }}
            text={route.params ? "Edit" : "Create"}
          />
        </View>
      )}
    </Background>
  );
}
