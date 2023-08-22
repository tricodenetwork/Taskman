import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../../styles/stylesheet";
import LowerButton from "../../components/LowerButton";

import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setVisible } from "../../store/slice-reducers/Formslice";
import { Motion } from "@legendapp/motion";
import {
  setName,
  setDuration,
  setNo,
  setCategory,
  setId,
} from "../../store/slice-reducers/JobSlice";
import { Modal } from "react-native";
import { useRoute } from "@react-navigation/native";
import { job as jobber } from "../../models/Task";
import { AccountRealmContext } from "../../models";
import OdinaryButton from "../../components/OdinaryButton";
import { KeyboardAvoidingView } from "react-native";

const { useRealm, useQuery } = AccountRealmContext;

export default function CreateJob({ navigation }) {
  const windowHeight = useWindowDimensions().height;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const route = useRoute();
  const realm = useRealm();
  const Cat = useQuery("category");
  const { visible } = useSelector((state) => state.app);
  const { Job } = useSelector((state) => state);
  const { id, name, category, no, duration } = Job;
  // const { jobId, name2, category2, no2, duration2 } = route.params;

  // console.log(jobId, name, category, no, duration);
  const job = realm?.objectForPrimaryKey(
    "job",
    Realm.BSON.ObjectId(route.params?.id)
  );

  const updateInitials = () => {
    if (route.params) {
      dispatch(setName(job.name));
      dispatch(setCategory(job.category));
    } else {
      dispatch(setName(""));
      return;
    }
  };

  useEffect(() => {
    updateInitials();
  }, []);

  const editJob = useCallback(
    (item) => {
      realm?.write(() => {
        const job = realm?.objectForPrimaryKey(
          "job",
          Realm.BSON.ObjectId(route.params?.id)
        );

        // const Item = JSON.parse(JSON.stringify(item));

        // console.log(typeof item.category, typeof Item.category);

        job.name = item.name;
        job.category = item.category;
      });

      alert("Job Edited Successfuly!");
    },
    [realm]
  );

  const createJob = useCallback(
    (item) => {
      if (!item) {
        return;
      }
      realm.write(() => {
        return new jobber(realm, item);
      });
      alert("New Job Created! 👷🏽‍♂️");
    },
    [realm]
  );

  return (
    <View style={{ minHeight: Math.round(windowHeight) }}>
      <Background bgColor='min-h-[98vh]'>
        <Topscreen
          onPress={() => {
            navigation.goBack();
          }}
          text={"Create Job"}
        />
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <View className='bg-slate-200 h-[75vh] rounded-t-3xl justify-start pt-[2vh] w-full absolute bottom-0'>
            <View className='flex items-center justify-center space-y-[25vh] h-[55vh]'>
              <View className='flex items-center justify-between w-[90%] flex-row'>
                <Text className='text-Supervisor3' style={styles.text_md2}>
                  Name:
                </Text>
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
                <Text className='text-Supervisor3' style={styles.text_md2}>
                  Category:
                </Text>
                <View className='w-[65vw] relative bg-slate-300  rounded-sm h-10'>
                  {visible && (
                    <Motion.View
                      initial={{ x: 100 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.2 }}
                      style={[styles.box, styles.Pcard]}
                      className='bg-white absolute bottom-0 right-0  space-y-1  border-[1px] border-Supervisor3 w-[65vw] flex justify-around rounded-md'
                    >
                      <FlatList
                        data={Cat}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => {
                              dispatch(setCategory(item));
                              dispatch(setVisible(!visible));
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
                    defaultValue={category?.name}
                    editable={false}
                    style={[
                      styles.averageText,
                      { color: "black", height: actuatedNormalizeVertical(50) },
                    ]}
                    value={Job.category?.name}
                    className='w-[65vw] bg-slate-300  rounded-sm h-10'
                  />
                </View>
                <View className='absolute right-[1vw]'>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(setVisible(!visible));
                    }}
                  >
                    <AntDesign
                      name='caretdown'
                      size={actuatedNormalize(20)}
                      color='rgb(147 51 234)'
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <LowerButton
              textStyle={"text-slate-200"}
              style={"w-[90vw]"}
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
    </View>
  );
}
